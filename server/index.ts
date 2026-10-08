import "dotenv/config"

import { app } from "./app.js"

import { checkDatabase, pool } from "./database.js"

const port = Number(process.env.PORT ?? 3001)

if (process.env.NODE_ENV === "production" && !process.env.APP_ORIGIN) {
  throw new Error("APP_ORIGIN must be configured in production")
}

try {
  await checkDatabase()

  const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`)
  })

  const shutdown = async () => {
    server.close(async () => {
      await pool.end()

      process.exit(0)
    })
  }

  process.on("SIGINT", shutdown)

  process.on("SIGTERM", shutdown)
} catch (error) {
  console.error("API startup failed:", error)

  await pool.end()

  process.exitCode = 1
}
