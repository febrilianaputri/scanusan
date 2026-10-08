import { apiRequest } from "./api"

interface LegacyInventory {
  products: Array<Record<string, string | number>>

  transactions: Array<Record<string, string | number>>

  suppliers: Array<Record<string, string | number>>
}

const fieldNames = {
  products: [
    "id",
    "name",
    "barcode",
    "category",
    "currentStock",
    "unit",
    "minStock",
    "status",
    "location",
    "supplier",
  ],

  transactions: [
    "id",
    "time",
    "barcode",
    "product",
    "type",
    "quantity",
    "prevStock",
    "currentStock",
    "scanner",
    "user",
  ],

  suppliers: ["id", "name", "contact", "products", "lastTransaction", "status"],
} as const

function readLegacyInventory(): LegacyInventory | null {
  try {
    const saved = localStorage.getItem("kami-inventory-data")

    if (!saved) return null

    const parsed: unknown = JSON.parse(saved)

    if (typeof parsed !== "object" || parsed === null) return null

    const source = parsed as Record<string, unknown>

    const migrated = {} as LegacyInventory

    for (const collection of Object.keys(
      fieldNames,
    ) as Array<keyof LegacyInventory>) {
      const rows = source[collection]

      if (!Array.isArray(rows)) return null

      migrated[collection] = rows.flatMap((row) => {
        if (typeof row !== "object" || row === null || Array.isArray(row))
          return []

        const record = row as Record<string, unknown>

        const sanitized: Record<string, string | number> = {}

        for (const field of fieldNames[collection]) {
          const value = record[field]

          if (typeof value === "string" || typeof value === "number")
            sanitized[field] = value
        }

        return [sanitized]
      })
    }

    return migrated
  } catch (error) {
    console.error(
      "Unable to inspect local inventory data for a safe one-time migration:",
      error,
    )

    return null
  }
}

const legacyInventory = readLegacyInventory()

export function clearLegacyBrowserData() {
  try {
    localStorage.removeItem("kami-auth-user")

    sessionStorage.removeItem("kami-auth-user")
  } catch (error) {
    console.error("Unable to clear legacy browser account data:", error)
  }
}

export async function migrateLegacyInventory() {
  if (!legacyInventory) return

  const { imported } = await apiRequest<{ imported: boolean }>(
    "/api/data/import-legacy",
    {
      method: "POST",

      body: JSON.stringify(legacyInventory),
    },
  )

  if (!imported) {
    console.warn(
      "Legacy inventory was not imported because server inventory already exists; the local copy was retained.",
    )

    return
  }

  try {
    localStorage.removeItem("kami-inventory-data")

    sessionStorage.removeItem("kami-inventory-data")
  } catch (error) {
    console.error("Unable to clear imported legacy inventory data:", error)
  }
}
