import mysql from "mysql2/promise"

const required = (name: string, fallback?: string) => {
  const value = process.env[name] ?? fallback

  if (!value) throw new Error(`Missing required environment variable: ${name}`)

  return value
}

export const pool = mysql.createPool({
  host: required("MYSQL_HOST"),

  port: Number(process.env.MYSQL_PORT ?? 3306),

  database: required("MYSQL_DATABASE"),

  user: required("MYSQL_USER"),

  password: required("MYSQL_PASSWORD"),

  ssl:
    process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: true } : undefined,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,

  timezone: "Z",
})

export async function checkDatabase() {
  await pool.query("SELECT 1")

  await pool.query(`
    INSERT INTO inventory_state (id, payload)
    VALUES (1, JSON_OBJECT('products', JSON_ARRAY(), 'transactions', JSON_ARRAY(), 'suppliers', JSON_ARRAY()))
    ON DUPLICATE KEY UPDATE id = id
  `)
}
