import { after, test } from "node:test"

import assert from "node:assert/strict"

import type { AddressInfo } from "node:net"

import ExcelJS from "exceljs"

import {
  createReportWorkbook,
  filterReportTransactions,
} from "./report-export.js"

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

    ["/api/reports/export.xlsx"],
    ["/api/reports/categories"],

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

test("report filters respect category and transaction dates", () => {
  const transactions = [
    {
      createdAt: "2026-10-10T12:00:00.000Z",
      time: "12:00:00",
      barcode: "network",
      product: "CAT6 UTP Cable",
      type: "in" as const,
      quantity: 2,
      prevStock: 1,
      currentStock: 3,
      scanner: "Scanner-01",
      user: "admin",
    },
    {
      createdAt: "2026-09-01T12:00:00.000Z",
      time: "12:00:00",
      barcode: "network",
      product: "CAT6 UTP Cable",
      type: "in" as const,
      quantity: 2,
      prevStock: 1,
      currentStock: 3,
      scanner: "Scanner-01",
      user: "admin",
    },
    {
      createdAt: "2026-10-10T12:00:00.000Z",
      time: "12:00:00",
      barcode: "fiber",
      product: "Fiber Patch",
      type: "out" as const,
      quantity: 1,
      prevStock: 4,
      currentStock: 3,
      scanner: "Scanner-02",
      user: "operator",
    },
    {
      time: "12:00:00",
      barcode: "network",
      product: "CAT6 UTP Cable",
      type: "in" as const,
      quantity: 2,
      prevStock: 1,
      currentStock: 3,
      scanner: "Scanner-01",
      user: "admin",
    },
  ]
  const categories = new Map([
    ["network", "Networking"],
    ["fiber", "Fiber"],
  ])

  assert.deepEqual(
    filterReportTransactions(transactions, categories, {
      category: "Networking",
      from: "2026-10-06",
      to: "2026-10-12",
    }).map((transaction) => transaction.createdAt),
    ["2026-10-10T12:00:00.000Z"],
  )
  assert.equal(filterReportTransactions(transactions, categories, {}).length, 4)
})

test("report workbook includes styled headers, cell borders, and fitted widths", async () => {
  const report = await createReportWorkbook(
    [
      {
        createdAt: "2026-10-10T12:00:00.000Z",
        time: "12:00:00",
        barcode: "899001234567",
        product: "CAT6 UTP Cable",
        type: "in",
        quantity: 2,
        prevStock: 1,
        currentStock: 3,
        scanner: "Scanner-01",
        user: "admin",
      },
    ],
    new Map([["899001234567", "Networking"]]),
  )
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(Uint8Array.from(report).buffer)
  const worksheet = workbook.getWorksheet("Inventory Report")

  assert.ok(worksheet)
  assert.equal(worksheet.getCell("A1").value, "Date")
  assert.equal(worksheet.getCell("A1").font.bold, true)
  const headerFill = worksheet.getCell("A1").fill
  assert.equal(headerFill.type, "pattern")
  if (headerFill.type === "pattern")
    assert.equal(headerFill.fgColor?.argb, "FF176B52")
  assert.equal(worksheet.getCell("A1").border.bottom?.style, "thin")
  assert.equal(worksheet.getCell("A2").border.bottom?.style, "thin")
  assert.equal(worksheet.getCell("D2").value, "CAT6 UTP Cable")
  assert.ok((worksheet.getColumn(4).width ?? 0) > 12)
})
