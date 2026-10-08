import type { RequestHandler } from "express"

import type { RowDataPacket } from "mysql2"

import { firebaseAdminAuth } from "./firebase-admin.js"

import { pool } from "./database.js"

import type { Employee } from "./types.js"

export const requireSession: RequestHandler = async (
  request,
  response,
  next,
) => {
  const sessionCookie = request.cookies?.kami_session

  if (!sessionCookie) {
    response.status(401).json({ error: "Authentication required" })

    return
  }

  try {
    const decoded = await firebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    )

    if (decoded.firebase?.sign_in_provider !== "custom") {
      response.status(401).json({
        error: "Session was not issued through the application login flow",
      })

      return
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT firebase_uid, email, name, phone, position, department, role, status, last_activity
       FROM employees WHERE firebase_uid = ? LIMIT 1`,

      [decoded.uid],
    )

    const row = rows[0]

    if (!row || row.status !== "active") {
      response.status(401).json({ error: "Account is inactive or unavailable" })

      return
    }

    request.employee = ({
      id: row.firebase_uid,

      email: row.email,

      name: row.name,

      phone: row.phone ?? undefined,

      position: row.position ?? undefined,

      department: row.department ?? undefined,

      role: row.role,

      status: row.status,

      lastActivity: row.last_activity
        ? new Date(row.last_activity).toISOString()
        : "",
    } satisfies Employee)

    next()
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      String(error.code).startsWith("auth/")
    ) {
      response.status(401).json({ error: "Session is invalid or expired" })

      return
    }

    next(error)
  }
}

export const requireAdmin: RequestHandler = (request, response, next) => {
  if (request.employee?.role !== "admin") {
    response.status(403).json({ error: "Administrator role required" })

    return
  }

  next()
}
