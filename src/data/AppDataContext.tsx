import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../auth/AuthContext"
import type { Product, Supplier, Transaction, User } from "../types"

interface AppData {
  products: Product[]
  transactions: Transaction[]
  suppliers: Supplier[]
  users: User[]
}

interface AppDataContextValue {
  data: AppData
  setData: Dispatch<SetStateAction<AppData>>
  refreshUsers: () => Promise<void>
  replaceUsers: (users: User[]) => void
  loading: boolean
  error: string | null
}

const emptyData: AppData = {
  products: [],
  transactions: [],
  suppliers: [],
  users: [],
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

function computeProductStatus(
  stock: number,
  minStock: number,
  rawStatus?: unknown
): Product["status"] {
  if (rawStatus === "good" || rawStatus === "low" || rawStatus === "out") {
    return rawStatus
  }
  if (stock <= 0) return "out"
  if (stock <= minStock) return "low"
  return "good"
}

// --- HELPER MAPPING PRODUCT ---
function mapProductFromDb(row: Record<string, unknown>): Product {
  const stockVal = Number(
    row.current_stock ?? row.currentStock ?? row.stock ?? 0
  )
  const minStockVal = Number(row.min_stock ?? row.minStock ?? 5)

  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    barcode: String(row.barcode ?? row.sku ?? row.id ?? ""),
    category: row.category ? String(row.category) : "",
    currentStock: stockVal,
    unit: row.unit ? String(row.unit) : "pcs",
    minStock: minStockVal,
    status: computeProductStatus(stockVal, minStockVal, row.status),
    location: row.location ? String(row.location) : "",
    supplier: row.supplier ? String(row.supplier) : "",
  }
}

function mapProductToDb(item: Product) {
  const p = item as unknown as Record<string, unknown>
  const stockVal = Number(item.currentStock ?? p.stock ?? 0)
  const minStockVal = Number(item.minStock ?? p.min_stock ?? 5)
  const codeValue = String(
    item.barcode || p.sku || item.id || "BARCODE-UNKNOWN"
  ).trim()

  return {
    id: String(item.id),
    sku: codeValue,
    name: String(item.name || "Produk Tanpa Nama"),
    category: item.category ? String(item.category) : null,
    stock: stockVal,
    min_stock: minStockVal,
    unit: item.unit ? String(item.unit) : "pcs",
    updated_at: new Date().toISOString(),
  }
}

// --- HELPER MAPPING TRANSACTION ---
function mapTransactionFromDb(row: Record<string, unknown>): Transaction {
  const createdAtVal = String(
    row.created_at ?? row.createdAt ?? new Date().toISOString()
  )
  const timeVal = row.time
    ? String(row.time)
    : new Date(createdAtVal).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })

  return {
    id: String(row.id ?? ""),
    time: timeVal,
    createdAt: createdAtVal,
    barcode: String(row.barcode ?? ""),
    product: String(row.product ?? row.product_name ?? row.productName ?? ""),
    type: (row.tx_type ?? row.type ?? "in") === "out" ? "out" : "in",
    quantity: Number(row.quantity ?? 0),
    prevStock: Number(row.prev_stock ?? row.prevStock ?? 0),
    currentStock: Number(row.current_stock ?? row.currentStock ?? 0),
    scanner: String(row.scanner ?? row.scanner_id ?? row.scannerId ?? "Scanner-01"),
    user: String(row.user ?? row.user_name ?? row.userName ?? "Admin"),
  }
}

function mapTransactionToDb(tx: Transaction) {
  const t = tx as unknown as Record<string, unknown>
  const createdAtVal = String(
    tx.createdAt ?? t.created_at ?? new Date().toISOString()
  )

  return {
    ...(tx.id ? { id: String(tx.id) } : {}),
    barcode: String(tx.barcode ?? ""),
    product_id: t.productId ? String(t.productId) : null,
    tx_type: tx.type === "out" ? "out" : "in",
    quantity: Number(tx.quantity ?? 0),
    scanner_id: String(tx.scanner ?? t.scanner_id ?? "Scanner-01"),
    source: t.source ? String(t.source) : "web",
    created_at: createdAtVal,
  }
}

// --- HELPER MAPPING SUPPLIER ---
function mapSupplierFromDb(row: Record<string, unknown>): Supplier {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    contact: row.contact ? String(row.contact) : "",
    products: Number(row.products ?? row.total_products ?? 0),
    lastTransaction: String(
      row.last_transaction ?? row.lastTransaction ?? "-"
    ),
    status: row.status === "inactive" ? "inactive" : "active",
  }
}

function mapSupplierToDb(item: Supplier) {
  const s = item as unknown as Record<string, unknown>
  return {
    id: String(item.id),
    name: String(item.name ?? ""),
    contact: item.contact ? String(item.contact) : null,
    address: s.address ? String(s.address) : null,
  }
}

// --- HELPER MAPPING USER ---
function mapUserFromDb(row: Record<string, unknown>): User {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    role: row.role === "operator" ? "operator" : "admin",
    status: row.status === "inactive" ? "inactive" : "active",
    lastActivity: String(row.last_activity ?? row.lastActivity ?? "-"),
  }
}

// --- PROVIDER ---
export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setDataState] = useState<AppData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const latestData = useRef(data)

  const fetchAllData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)

    try {
      const [productsRes, transactionsRes, suppliersRes] = await Promise.all([
        supabase.from("products").select("*").order("name", { ascending: true }),
        supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("suppliers").select("*").order("name", { ascending: true }),
      ])

      if (productsRes.error) throw productsRes.error
      if (transactionsRes.error) throw transactionsRes.error

      const nextData: AppData = {
        products: (productsRes.data ?? []).map((row) =>
          mapProductFromDb(row as Record<string, unknown>)
        ),
        transactions: (transactionsRes.data ?? []).map((row) =>
          mapTransactionFromDb(row as Record<string, unknown>)
        ),
        suppliers: suppliersRes.error
          ? latestData.current.suppliers
          : (suppliersRes.data ?? []).map((row) =>
              mapSupplierFromDb(row as Record<string, unknown>)
            ),
        users: latestData.current.users,
      }

      latestData.current = nextData
      setDataState(nextData)
      setError(null)
    } catch (err) {
      console.error("Supabase fetch error:", err)
      setError("Gagal terhubung ke database Supabase.")
    } finally {
      setLoading(false)
    }
  }, [])

  // 1. Muat awal & dengarkan perubahan real-time dari Supabase
  useEffect(() => {
    fetchAllData(true)

    const channel = supabase
      .channel("kami-inventory-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchAllData(false)
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          fetchAllData(false)
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "suppliers" },
        () => {
          fetchAllData(false)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchAllData])

  // 2. Ambil data users dari tabel 'users' jika pengguna adalah admin
  const refreshUsers = useCallback(async () => {
    if (user?.role !== "admin") return

    try {
      const { data: userRows, error: userError } = await supabase
        .from("users")
        .select("*")

      if (userError) throw userError

      const userList = (userRows ?? []).map((row) =>
        mapUserFromDb(row as Record<string, unknown>)
      )
      const nextData = { ...latestData.current, users: userList }
      latestData.current = nextData
      setDataState(nextData)
    } catch (err) {
      console.error("Error fetching users from Supabase:", err)
    }
  }, [user?.role])

  useEffect(() => {
    if (user?.role === "admin") {
      refreshUsers()
    }
  }, [user?.role, refreshUsers])

  // 3. Simpan perubahan data ke Supabase PostgreSQL
  const setData: Dispatch<SetStateAction<AppData>> = useCallback(
    async (action) => {
      const prevData = latestData.current
      const nextData =
        typeof action === "function" ? action(prevData) : action

      const validBarcodes = new Set(
        nextData.products
          .map((p) => String(p.barcode ?? "").trim().toLowerCase())
          .filter(Boolean)
      )

      const filteredTransactions = nextData.transactions.filter((tx) => {
        const code = String(tx.barcode ?? "").trim().toLowerCase()
        if (!code || validBarcodes.size === 0) return true
        return validBarcodes.has(code)
      })

      const finalData: AppData = {
        ...nextData,
        transactions: filteredTransactions,
      }

      latestData.current = finalData
      setDataState(finalData)

      try {
        if (finalData.products.length > 0) {
          const { error: prodErr } = await supabase
            .from("products")
            .upsert(finalData.products.map(mapProductToDb), { onConflict: "id" })
          if (prodErr) throw prodErr
        }

        if (finalData.transactions.length > 0) {
          const { error: txErr } = await supabase
            .from("transactions")
            .upsert(finalData.transactions.map(mapTransactionToDb), {
              onConflict: "id",
            })
          if (txErr) throw txErr
        }

        if (finalData.suppliers.length > 0) {
          const { error: supErr } = await supabase
            .from("suppliers")
            .upsert(finalData.suppliers.map(mapSupplierToDb), {
              onConflict: "id",
            })
          if (supErr && supErr.code !== "42P01") throw supErr
        }

        const nextProductIds = new Set(finalData.products.map((p) => p.id))
        const removedProductIds = prevData.products
          .filter((p) => !nextProductIds.has(p.id))
          .map((p) => p.id)

        if (removedProductIds.length > 0) {
          const { error: delProdErr } = await supabase
            .from("products")
            .delete()
            .in("id", removedProductIds)
          if (delProdErr) throw delProdErr
        }

        const nextTxIds = new Set(finalData.transactions.map((t) => t.id))
        const removedTxIds = prevData.transactions
          .filter((t) => !nextTxIds.has(t.id) && Boolean(t.id))
          .map((t) => t.id)

        if (removedTxIds.length > 0) {
          const { error: delTxErr } = await supabase
            .from("transactions")
            .delete()
            .in("id", removedTxIds)
          if (delTxErr) throw delTxErr
        }

        setError(null)
      } catch (saveError) {
        console.error("Unable to save data to Supabase:", saveError)
        setError("Perubahan gagal disimpan ke database Supabase.")
      }
    },
    []
  )

  const replaceUsers = useCallback((users: User[]) => {
    const nextData = { ...latestData.current, users }
    latestData.current = nextData
    setDataState(nextData)
  }, [])

  return (
    <AppDataContext.Provider
      value={{ data, setData, refreshUsers, replaceUsers, loading, error }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context)
    throw new Error("useAppData must be used inside AppDataProvider")
  return context
}