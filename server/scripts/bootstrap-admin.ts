import "dotenv/config"

import { hash } from "bcryptjs"

import type { RowDataPacket } from "mysql2"

import { pool, checkDatabase } from "../database.js"

import { firebaseAdminAuth } from "../firebase-admin.js"

const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim()

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase()

const password = process.env.BOOTSTRAP_ADMIN_PASSWORD

if (
  !name ||
  !email ||
  !password ||
  password.length < 12 ||
  Buffer.byteLength(password, "utf8") > 72
) {
  throw new Error(
    "Set BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, and a BOOTSTRAP_ADMIN_PASSWORD of 12 to 72 UTF-8 bytes",
  )
}

try {
  await checkDatabase()

  const auth = firebaseAdminAuth()

  let firebaseUser

  let createdFirebaseUser = false

  try {
    firebaseUser = await auth.getUserByEmail(email)
  } catch (error) {
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== "auth/user-not-found"
    ) {
      throw error
    }

    firebaseUser = await auth.createUser({ email, displayName: name })

    createdFirebaseUser = true
  }

  try {
    const passwordHash = await hash(password, 12)

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT firebase_uid FROM employees WHERE email = ? FOR UPDATE",

        [email],
      )

      if (rows[0] && rows[0].firebase_uid !== firebaseUser.uid) {
        throw new Error(
          "The email is already linked to a different Firebase identity",
        )
      }

      if (rows[0]) {
        await connection.execute(
          `UPDATE employees SET name = ?, password_hash = ?, role = 'admin', status = 'active'
           WHERE firebase_uid = ?`,

          [name, passwordHash, firebaseUser.uid],
        )
      } else {
        await connection.execute(
          `INSERT INTO employees (firebase_uid, email, name, password_hash, role, status)
           VALUES (?, ?, ?, ?, 'admin', 'active')`,

          [firebaseUser.uid, email, name, passwordHash],
        )
      }

      await connection.commit()

      console.log(`Administrator provisioned for ${email}`)
    } catch (error) {
      await connection.rollback()

      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    if (createdFirebaseUser) {
      try {
        await auth.deleteUser(firebaseUser.uid)
      } catch (rollbackError) {
        console.error(
          "Failed to roll back the provisioned Firebase identity:",
          rollbackError,
        )
      }
    }

    throw error
  }
} finally {
  await pool.end()
}
