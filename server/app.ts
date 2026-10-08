import express, { type ErrorRequestHandler, type RequestHandler } from "express"

import cookieParser from "cookie-parser"

import helmet from "helmet"

import { rateLimit } from "express-rate-limit"

import { z } from "zod"

import { compare, hash, hashSync } from "bcryptjs"

import type { ResultSetHeader, RowDataPacket } from "mysql2"

import { firebaseAdminAuth } from "./firebase-admin.js"

import { pool } from "./database.js"

import { requireAdmin, requireSession } from "./auth-middleware.js"

import type { Employee } from "./types.js"

const SESSION_COOKIE = "kami_session"

const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000

const isProduction = process.env.NODE_ENV === "production"

const app = express()

app.disable("x-powered-by")

app.set("trust proxy", isProduction ? 1 : false)

app.use(helmet())

app.use(express.json({ limit: "1mb" }))

app.use(cookieParser())

const verifyOrigin: RequestHandler = (request, response, next) => {
  if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "OPTIONS"
  ) {
    next()

    return
  }

  const origin = request.get("origin")

  const configuredOrigin = process.env.APP_ORIGIN

  if (isProduction && (!origin || origin !== configuredOrigin)) {
    response.status(403).json({ error: "Request origin is not allowed" })

    return
  }

  if (
    !isProduction &&
    origin &&
    configuredOrigin &&
    origin !== configuredOrigin
  ) {
    response.status(403).json({ error: "Request origin is not allowed" })

    return
  }

  next()
}

app.use("/api", verifyOrigin)

app.use("/api", (_request, response, next) => {
  response.setHeader("Cache-Control", "no-store")

  next()
})

const requireInventoryAccess: RequestHandler = (request, response, next) => {
  if (
    request.employee?.role !== "admin" &&
    request.employee?.role !== "operator"
  ) {
    response
      .status(403)
      .json({ error: "Inventory access is not allowed for this role" })

    return
  }

  next()
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: { error: "Too many login attempts. Try again later." },
})

const DUMMY_PASSWORD_HASH = hashSync(
  "invalid-login-probe-not-a-real-password",
  12,
)

const passwordSchema = z
  .string()
  .min(12)
  .max(72)

  .refine((password) => Buffer.byteLength(password, "utf8") <= 72)

const credentialsSchema = z
  .object({
    email: z.string().trim().email().max(254).toLowerCase(),

    password: z
      .string()
      .min(1)
      .max(72)

      .refine((password) => Buffer.byteLength(password, "utf8") <= 72),
  })
  .strict()

app.post("/api/auth/login", loginLimiter, async (request, response, next) => {
  const parsed = credentialsSchema.safeParse(request.body)

  if (!parsed.success) {
    response.status(400).json({ error: "Email and password are required" })

    return
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT firebase_uid, password_hash, status
       FROM employees WHERE email = ? LIMIT 1`,

      [parsed.data.email],
    )

    const employee = rows[0]

    const passwordMatches = await compare(
      parsed.data.password,

      employee?.password_hash ?? DUMMY_PASSWORD_HASH,
    )

    if (!employee || employee.status !== "active" || !passwordMatches) {
      response.status(401).json({ error: "Invalid email or password" })

      return
    }

    const customToken = await firebaseAdminAuth().createCustomToken(
      employee.firebase_uid,
    )

    response.json({ customToken })
  } catch (error) {
    next(error)
  }
})

const sessionSchema = z
  .object({
    idToken: z.string().min(1),

    remember: z.boolean().default(false),
  })
  .strict()

app.get("/api/health", (_request, response) => response.json({ status: "ok" }))

app.post("/api/auth/session", loginLimiter, async (request, response, next) => {
  const parsed = sessionSchema.safeParse(request.body)

  if (!parsed.success) {
    response.status(400).json({ error: "Invalid login request" })

    return
  }

  try {
    const decoded = await firebaseAdminAuth().verifyIdToken(
      parsed.data.idToken,
      true,
    )

    if (decoded.firebase?.sign_in_provider !== "custom") {
      response.status(401).json({ error: "Application login is required" })

      return
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT firebase_uid, email, name, phone, position, department, role, status
       FROM employees WHERE firebase_uid = ? LIMIT 1`,

      [decoded.uid],
    )

    const row = rows[0]

    if (!row || row.status !== "active") {
      response
        .status(403)
        .json({ error: "This account is not enabled for this application" })

      return
    }

    const cookie = await firebaseAdminAuth().createSessionCookie(
      parsed.data.idToken,
      {
        expiresIn: SESSION_DURATION_MS,
      },
    )

    response.cookie(SESSION_COOKIE, cookie, {
      httpOnly: true,

      secure: isProduction,

      sameSite: "strict",

      path: "/api",

      ...(parsed.data.remember ? { maxAge: SESSION_DURATION_MS } : {}),
    })

    await pool.execute(
      "UPDATE employees SET last_activity = CURRENT_TIMESTAMP WHERE firebase_uid = ?",

      [decoded.uid],
    )

    response.json({
      user: {
        id: row.firebase_uid,
        email: row.email,
        name: row.name,

        phone: row.phone ?? undefined,
        position: row.position ?? undefined,

        department: row.department ?? undefined,
        role: row.role,
      },
    })
  } catch (error) {
    if (isFirebaseAuthError(error)) {
      response.status(401).json({ error: "Invalid or expired identity token" })

      return
    }

    next(error)
  }
})

app.delete("/api/auth/session", (_request, response) => {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: true,

    secure: isProduction,

    sameSite: "strict",

    path: "/api",
  })

  response.status(204).end()
})

app.get("/api/auth/session", requireSession, (request, response) => {
  response.setHeader("Cache-Control", "no-store")

  response.json({ user: publicEmployee(request.employee!) })
})

const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(120),

    phone: z.string().trim().max(40).optional(),

    position: z.string().trim().max(120).optional(),

    department: z.string().trim().max(120).optional(),
  })
  .strict()

app.patch(
  "/api/auth/profile",
  requireSession,
  async (request, response, next) => {
    const parsed = profileSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({
        error: "Invalid profile data",
        details: parsed.error.flatten(),
      })

      return
    }

    try {
      await pool.execute(
        `UPDATE employees SET name = ?, phone = ?, position = ?, department = ?
       WHERE firebase_uid = ?`,

        [
          parsed.data.name,
          parsed.data.phone ?? null,
          parsed.data.position ?? null,

          parsed.data.department ?? null,
          request.employee!.id,
        ],
      )

      await firebaseAdminAuth().updateUser(request.employee!.id, {
        displayName: parsed.data.name,
      })

      response.json({
        user: {
          ...publicEmployee(request.employee!),

          name: parsed.data.name,

          phone: parsed.data.phone,

          position: parsed.data.position,

          department: parsed.data.department,
        },
      })
    } catch (error) {
      next(error)
    }
  },
)

const employeeCreateSchema = z
  .object({
    name: z.string().trim().min(1).max(120),

    email: z.string().trim().email().max(254).toLowerCase(),

    password: passwordSchema,

    role: z.enum(["admin", "operator"]),

    phone: z.string().trim().max(40).optional(),

    position: z.string().trim().max(120).optional(),

    department: z.string().trim().max(120).optional(),
  })
  .strict()

const employeeUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),

    role: z.enum(["admin", "operator"]).optional(),

    status: z.enum(["active", "inactive"]).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0)

app.get(
  "/api/users",
  requireSession,
  requireAdmin,
  async (_request, response, next) => {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT firebase_uid, email, name, role, status, last_activity
       FROM employees ORDER BY name`,
      )

      response.json({
        users: rows.map((row) => ({
          id: row.firebase_uid,

          email: row.email,

          name: row.name,

          role: row.role,

          status: row.status,

          lastActivity: row.last_activity
            ? new Date(row.last_activity).toISOString()
            : "Never",
        })),
      })
    } catch (error) {
      next(error)
    }
  },
)

app.post(
  "/api/users",
  requireSession,
  requireAdmin,
  async (request, response, next) => {
    const parsed = employeeCreateSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({
        error: "Invalid employee data",
        details: parsed.error.flatten(),
      })

      return
    }

    let firebaseUid: string | undefined

    try {
      const auth = firebaseAdminAuth()

      const firebaseUser = await auth.createUser({
        email: parsed.data.email,

        displayName: parsed.data.name,
      })

      firebaseUid = firebaseUser.uid

      const passwordHash = await hash(parsed.data.password, 12)

      await pool.execute(
        `INSERT INTO employees
       (firebase_uid, email, name, password_hash, phone, position, department, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,

        [
          firebaseUid,
          parsed.data.email,
          parsed.data.name,
          passwordHash,
          parsed.data.phone ?? null,

          parsed.data.position ?? null,
          parsed.data.department ?? null,
          parsed.data.role,
        ],
      )

      response.status(201).json({
        user: {
          id: firebaseUid,
          email: parsed.data.email,
          name: parsed.data.name,

          role: parsed.data.role,
          status: "active",
          lastActivity: "Never",
        },
      })
    } catch (error) {
      if (firebaseUid) {
        try {
          await firebaseAdminAuth().deleteUser(firebaseUid)
        } catch (rollbackError) {
          console.error(
            "Failed to roll back Firebase user after employee creation failure",
            rollbackError,
          )
        }
      }

      if (isDuplicateError(error)) {
        response
          .status(409)
          .json({ error: "An account with this email already exists" })

        return
      }

      next(error)
    }
  },
)

const passwordResetSchema = z
  .object({
    password: passwordSchema,
  })
  .strict()

app.post(
  "/api/users/:id/reset-password",
  requireSession,
  requireAdmin,
  async (request, response, next) => {
    const employeeId = request.params.id

    if (typeof employeeId !== "string") {
      response.status(400).json({ error: "Invalid employee id" })

      return
    }

    if (employeeId === request.employee!.id) {
      response.status(400).json({
        error: "Use the account recovery process to reset your own password",
      })

      return
    }

    const parsed = passwordResetSchema.safeParse(request.body)

    if (!parsed.success) {
      response
        .status(400)
        .json({ error: "Password must contain at least 12 characters" })

      return
    }

    try {
      const passwordHash = await hash(parsed.data.password, 12)

      const [employees] = await pool.execute<RowDataPacket[]>(
        "SELECT firebase_uid FROM employees WHERE firebase_uid = ? LIMIT 1",

        [employeeId],
      )

      if (!employees[0]) {
        response.status(404).json({ error: "Employee not found" })

        return
      }

      await firebaseAdminAuth().revokeRefreshTokens(employeeId)

      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE employees SET password_hash = ? WHERE firebase_uid = ?",

        [passwordHash, employeeId],
      )

      if (result.affectedRows === 0) {
        response.status(404).json({ error: "Employee not found" })

        return
      }

      response.status(204).end()
    } catch (error) {
      next(error)
    }
  },
)

app.patch(
  "/api/users/:id",
  requireSession,
  requireAdmin,
  async (request, response, next) => {
    const employeeId = request.params.id

    if (typeof employeeId !== "string") {
      response.status(400).json({ error: "Invalid employee id" })

      return
    }

    const parsed = employeeUpdateSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({
        error: "Invalid employee update",
        details: parsed.error.flatten(),
      })

      return
    }

    if (
      employeeId === request.employee!.id &&
      (parsed.data.role === "operator" || parsed.data.status === "inactive")
    ) {
      response
        .status(400)
        .json({ error: "You cannot remove your own administrator access" })

      return
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT role, status FROM employees WHERE firebase_uid = ? FOR UPDATE",

        [employeeId],
      )

      const current = rows[0]

      if (!current) {
        await connection.rollback()

        response.status(404).json({ error: "Employee not found" })

        return
      }

      const removesAdmin =
        current.role === "admin" &&
        current.status === "active" &&
        (parsed.data.role === "operator" || parsed.data.status === "inactive")

      if (removesAdmin) {
        const [admins] = await connection.query<RowDataPacket[]>(
          `SELECT firebase_uid FROM employees WHERE role = 'admin' AND status = 'active' FOR UPDATE`,
        )

        if (admins.length <= 1) {
          await connection.rollback()

          response
            .status(409)
            .json({ error: "At least one active administrator must remain" })

          return
        }
      }

      await connection.execute(
        `UPDATE employees SET
       name = COALESCE(?, name), role = COALESCE(?, role), status = COALESCE(?, status)
       WHERE firebase_uid = ?`,

        [
          parsed.data.name ?? null,
          parsed.data.role ?? null,
          parsed.data.status ?? null,
          employeeId,
        ],
      )

      await connection.commit()

      if (parsed.data.status) {
        await firebaseAdminAuth().updateUser(employeeId, {
          disabled: parsed.data.status === "inactive",
        })

        if (parsed.data.status === "inactive") {
          await firebaseAdminAuth().revokeRefreshTokens(employeeId)
        }
      }

      response.json({ status: "updated" })
    } catch (error) {
      await connection.rollback()

      next(error)
    } finally {
      connection.release()
    }
  },
)

const appDataSchema = z
  .object({
    products: z.array(
      z
        .object({
          id: z.string().min(1),

          name: z.string(),

          barcode: z.string(),

          category: z.string(),

          currentStock: z.number().int().nonnegative(),

          unit: z.string(),

          minStock: z.number().int().nonnegative(),

          status: z.enum(["good", "low", "out"]),

          location: z.string(),

          supplier: z.string(),
        })
        .strict(),
    ),

    transactions: z.array(
      z
        .object({
          id: z.string().min(1),

          time: z.string(),

          barcode: z.string(),

          product: z.string(),

          type: z.enum(["in", "out"]),

          quantity: z.number().int().positive(),

          prevStock: z.number().int().nonnegative(),

          currentStock: z.number().int().nonnegative(),

          scanner: z.string(),

          user: z.string(),
        })
        .strict(),
    ),

    suppliers: z.array(
      z
        .object({
          id: z.string().min(1),

          name: z.string(),

          contact: z.string(),

          products: z.number().int().nonnegative(),

          lastTransaction: z.string(),

          status: z.enum(["active", "inactive"]),
        })
        .strict(),
    ),
  })
  .strict()
  .superRefine((data, context) => {
    const unique = (values: string[]) => new Set(values).size === values.length

    if (
      !unique(data.products.map((product) => product.id)) ||
      !unique(data.products.map((product) => product.barcode))
    ) {
      context.addIssue({
        code: "custom",
        path: ["products"],
        message: "Product IDs and barcodes must be unique",
      })
    }

    if (!unique(data.transactions.map((transaction) => transaction.id))) {
      context.addIssue({
        code: "custom",
        path: ["transactions"],
        message: "Transaction IDs must be unique",
      })
    }

    if (!unique(data.suppliers.map((supplier) => supplier.id))) {
      context.addIssue({
        code: "custom",
        path: ["suppliers"],
        message: "Supplier IDs must be unique",
      })
    }

    if (
      data.products.some((product) => {
        const expectedStatus =
          product.currentStock === 0
            ? "out"
            : product.currentStock < product.minStock
              ? "low"
              : "good"

        return product.status !== expectedStatus
      })
    ) {
      context.addIssue({
        code: "custom",
        path: ["products"],
        message: "Product status must match its stock level",
      })
    }
  })

app.get(
  "/api/data",
  requireSession,
  requireInventoryAccess,
  async (request, response, next) => {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT payload FROM inventory_state WHERE id = 1",
      )

      const payload = rows[0]?.payload ?? {
        products: [],
        transactions: [],
        suppliers: [],
      }

      response.setHeader("Cache-Control", "no-store")

      if (request.employee!.role === "admin") {
        response.json(payload)
      } else {
        const validated = appDataSchema.parse(payload)

        response.json({ ...validated, suppliers: [] })
      }
    } catch (error) {
      next(error)
    }
  },
)

app.put(
  "/api/data",
  requireSession,
  requireInventoryAccess,
  async (request, response, next) => {
    const parsed = appDataSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({
        error: "Invalid inventory data",
        details: parsed.error.flatten(),
      })

      return
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      let persistedData = parsed.data

      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT payload FROM inventory_state WHERE id = 1 FOR UPDATE",
      )

      const current = appDataSchema.parse(
        rows[0]?.payload ?? {
          products: [],
          transactions: [],
          suppliers: [],
        },
      )

      if (request.employee!.role !== "admin") {
        if (parsed.data.suppliers.length > 0) {
          await connection.rollback()

          response
            .status(403)
            .json({ error: "Administrator role required to manage suppliers" })

          return
        }

        const previousTransactions = current.transactions

        const retainedTransactions = parsed.data.transactions.slice(
          parsed.data.transactions.length - previousTransactions.length,
        )

        if (
          parsed.data.transactions.length < previousTransactions.length ||
          !previousTransactions.every((transaction, index) =>
            sameTransaction(transaction, retainedTransactions[index]),
          )
        ) {
          await connection.rollback()

          response.status(403).json({
            error: "Operators cannot edit or remove transaction history",
          })

          return
        }

        const newTransactions = parsed.data.transactions.slice(
          0,

          parsed.data.transactions.length - previousTransactions.length,
        )

        const expectedStock = new Map(
          current.products.map((product) => [
            product.barcode,
            product.currentStock,
          ]),
        )

        const transactionBarcodes = new Set<string>()

        for (const transaction of [...newTransactions].reverse()) {
          const stockBefore = expectedStock.get(transaction.barcode)

          const product = parsed.data.products.find(
            (item) => item.barcode === transaction.barcode,
          )

          const nextStock =
            transaction.type === "in"
              ? transaction.prevStock + transaction.quantity
              : transaction.prevStock - transaction.quantity

          if (
            transaction.user !== request.employee!.name ||
            stockBefore === undefined ||
            transaction.prevStock !== stockBefore ||
            transaction.currentStock !== nextStock ||
            !product
          ) {
            await connection.rollback()

            response.status(403).json({
              error:
                "Stock transaction does not match the authenticated employee or current stock",
            })

            return
          }

          expectedStock.set(transaction.barcode, transaction.currentStock)

          transactionBarcodes.add(transaction.barcode)
        }

        for (const barcode of transactionBarcodes) {
          const expected = expectedStock.get(barcode)!

          const product = parsed.data.products.find(
            (item) => item.barcode === barcode,
          )

          if (product && product.currentStock !== expected) {
            await connection.rollback()

            response.status(403).json({
              error: "Stock balance must match the recorded stock transactions",
            })

            return
          }
        }

        persistedData = { ...parsed.data, suppliers: current.suppliers }
      }

      await connection.execute(
        "UPDATE inventory_state SET payload = ? WHERE id = 1",

        [JSON.stringify(persistedData)],
      )

      await connection.commit()

      response.status(204).end()
    } catch (error) {
      await connection.rollback()

      next(error)
    } finally {
      connection.release()
    }
  },
)

app.post(
  "/api/data/import-legacy",
  requireSession,
  requireAdmin,
  async (request, response, next) => {
    const parsed = appDataSchema.safeParse(request.body)

    if (!parsed.success) {
      response.status(400).json({
        error: "Invalid legacy inventory data",
        details: parsed.error.flatten(),
      })

      return
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT payload, legacy_imported_at FROM inventory_state WHERE id = 1 FOR UPDATE",
      )

      const current = appDataSchema.parse(
        rows[0]?.payload ?? {
          products: [],
          transactions: [],
          suppliers: [],
        },
      )

      const empty =
        current.products.length === 0 &&
        current.transactions.length === 0 &&
        current.suppliers.length === 0

      if (!rows[0] || rows[0].legacy_imported_at || !empty) {
        await connection.rollback()

        response.json({ imported: false })

        return
      }

      await connection.execute(
        `UPDATE inventory_state SET payload = ?, legacy_imported_at = CURRENT_TIMESTAMP WHERE id = 1`,

        [JSON.stringify(parsed.data)],
      )

      await connection.commit()

      response.json({ imported: true })
    } catch (error) {
      await connection.rollback()

      next(error)
    } finally {
      connection.release()
    }
  },
)

app.get(
  "/api/reports/export.csv",
  requireSession,
  requireAdmin,
  async (_request, response, next) => {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT payload FROM inventory_state WHERE id = 1",
      )

      const payload = appDataSchema.parse(
        rows[0]?.payload ?? {
          products: [],
          transactions: [],
          suppliers: [],
        },
      )

      const transactions =
        payload.transactions as Array<Record<string, unknown>>

      const csvCell = (value: unknown) => {
        const text = String(value ?? "")

        const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text

        return `"${safeText.replace(/"/g, '""')}"`
      }

      const lines = [
        [
          "Time",
          "Barcode",
          "Product",
          "Type",
          "Quantity",
          "Previous Stock",
          "Current Stock",
          "Scanner",
          "User",
        ],

        ...transactions.map((row) => [
          row.time,
          row.barcode,
          row.product,
          row.type,
          row.quantity,

          row.prevStock,
          row.currentStock,
          row.scanner,
          row.user,
        ]),
      ]

      response.setHeader("Content-Type", "text/csv; charset=utf-8")

      response.setHeader(
        "Content-Disposition",
        'attachment; filename="kami-inventory-report.csv"',
      )

      response.setHeader("Cache-Control", "no-store")

      response.send(
        lines.map((line) => line.map(csvCell).join(",")).join("\r\n"),
      )
    } catch (error) {
      next(error)
    }
  },
)

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error("API request failed:", error)

  if (response.headersSent) return

  response.status(500).json({ error: "Internal server error" })
}

app.use(errorHandler)

function publicEmployee(employee: Employee) {
  return {
    id: employee.id,

    name: employee.name,

    email: employee.email,

    role: employee.role,

    phone: employee.phone,

    position: employee.position,

    department: employee.department,
  }
}

function isDuplicateError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "ER_DUP_ENTRY" ||
      error.code === "auth/email-already-exists")
  )
}

function isFirebaseAuthError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    String(error.code).startsWith("auth/")
  )
}

function sameTransaction(
  left: z.infer<typeof appDataSchema>["transactions"][number] | undefined,

  right: z.infer<typeof appDataSchema>["transactions"][number] | undefined,
) {
  if (!left || !right) return false

  return (
    left.id === right.id &&
    left.time === right.time &&
    left.barcode === right.barcode &&
    left.product === right.product &&
    left.type === right.type &&
    left.quantity === right.quantity &&
    left.prevStock === right.prevStock &&
    left.currentStock === right.currentStock &&
    left.scanner === right.scanner &&
    left.user === right.user
  )
}

export { app }
