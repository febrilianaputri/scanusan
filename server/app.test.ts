import { after, test } from "node:test"

import assert from "node:assert/strict"

import type { AddressInfo } from "node:net"

import type { Request, Response } from "express"

process.env.NODE_ENV = "test"

process.env.MYSQL_HOST = "127.0.0.1"

process.env.MYSQL_DATABASE = "scanusan_test"

process.env.MYSQL_USER = "scanusan_test"

process.env.MYSQL_PASSWORD = "unused-test-password"

const { app } = await import("./app.js")

const { requireAdmin } = await import("./auth-middleware.js")

const server = app.listen(0)

const baseUrl = await new Promise<string>((resolve) => {
  server.once("listening", () => {
    resolve(`http://127.0.0.1:${(server.address() as AddressInfo).port}`)
  })
})

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

test("health check is public", async () => {
  const response = await fetch(`${baseUrl}/api/health`)

  assert.equal(response.status, 200)

  assert.deepEqual(await response.json(), { status: "ok" })
})

test("there is no public registration endpoint", async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "anyone@example.test",
      password: "not-a-valid-account",
    }),
  })
  assert.equal(response.status, 404)
})

test("login requires a valid credentials payload", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })
  assert.equal(response.status, 400)
})

test("all sensitive APIs reject requests without a server session", async () => {
  const requests: Array<[string, RequestInit?]> = [
    ["/api/auth/session"],

    ["/api/data"],

    ["/api/users"],

    ["/api/reports/export.csv"],

    [
      "/api/users/operator/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    ],

    [
      "/api/data/import-legacy",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    ],

    [
      "/api/auth/profile",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    ],

    [
      "/api/data",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    ],

    [
      "/api/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
    ],
  ]

  for (const [path, init] of requests) {
    const response = await fetch(`${baseUrl}${path}`, init)

    assert.equal(
      response.status,
      401,
      `${init?.method ?? "GET"} ${path} must require a session`,
    )
  }
})

test("administrator middleware returns 403 for operator sessions", () => {
  let statusCode = 200

  let body: unknown

  let continued = false

  const response = {
    status(code: number) {
      statusCode = code
      return this
    },

    json(value: unknown) {
      body = value
      return this
    },
  } as Response

  requireAdmin(
    {
      employee: {
        id: "operator",
        name: "Operator",
        email: "operator@example.test",
        role: "operator",
        status: "active",
        lastActivity: "",
      },
    } as Request,

    response,

    () => {
      continued = true
    },
  )

  assert.equal(statusCode, 403)

  assert.deepEqual(body, { error: "Administrator role required" })

  assert.equal(continued, false)
})
