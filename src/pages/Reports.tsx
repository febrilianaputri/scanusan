import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { useState, useMemo } from "react"
import * as XLSX from "xlsx"

import { useAppData } from "../data/AppDataContext"
import { useLanguage } from "../i18n"

const ALL_CATEGORIES = "__all_categories__"

export default function Reports() {
  const { data } = useAppData()
  const { language, t } = useLanguage()

  const [exportError, setExportError] = useState("")
  const [exporting, setExporting] = useState(false)
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [dateRange, setDateRange] = useState("all")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  // 1. Ambil daftar kategori unik langsung dari data produk Firebase
  const categories = useMemo(() => {
    const cats = data.products
      .map((p) => p.category)
      .filter((c): c is string => Boolean(c) && c.trim() !== "")
    return Array.from(new Set(cats))
  }, [data.products])

  const chartData = data.transactions
    .slice(0, 7)
    .reverse()
    .map((transaction) => ({
      day: transaction.time,
      in: transaction.type === "in" ? transaction.quantity : 0,
      out: transaction.type === "out" ? transaction.quantity : 0,
    }))

  const totalIn = data.transactions
    .filter((transaction) => transaction.type === "in")
    .reduce((sum, transaction) => sum + transaction.quantity, 0)

  const totalOut = data.transactions
    .filter((transaction) => transaction.type === "out")
    .reduce((sum, transaction) => sum + transaction.quantity, 0)

  const movements = data.products
    .map((product) => ({
      product,
      quantity: data.transactions
        .filter((transaction) => transaction.barcode === product.barcode)
        .reduce((sum, transaction) => sum + transaction.quantity, 0),
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  const maxMovement = Math.max(1, ...movements.map((item) => item.quantity))

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // 2. Fungsi Export Excel langsung dari data Firebase tanpa Backend API
  const exportReport = () => {
    setExporting(true)
    setExportError("")

    try {
      let filteredTransactions = [...data.transactions]

      // Filter berdasarkan kategori produk
      if (category !== ALL_CATEGORIES) {
        const productBarcodes = data.products
          .filter((p) => p.category === category)
          .map((p) => p.barcode)
        filteredTransactions = filteredTransactions.filter((t) =>
          productBarcodes.includes(t.barcode)
        )
      }

      // Filter berdasarkan rentang tanggal
      if (dateRange === "custom") {
        if (!customFrom || !customTo || customFrom > customTo) {
          throw new Error(t("Please select a valid date range."))
        }
        filteredTransactions = filteredTransactions.filter((t) => {
          if (!t.createdAt && !t.time) return false
          const txDate = (t.createdAt || t.time).split("T")[0]
          return txDate >= customFrom && txDate <= customTo
        })
      } else if (dateRange !== "all") {
        const days = Number(dateRange)
        const today = new Date()
        const start = new Date(today)
        start.setDate(today.getDate() - days + 1)
        const fromStr = formatLocalDate(start)
        const toStr = formatLocalDate(today)

        filteredTransactions = filteredTransactions.filter((t) => {
          if (!t.createdAt && !t.time) return false
          const txDate = (t.createdAt || t.time).split("T")[0]
          return txDate >= fromStr && txDate <= toStr
        })
      }

      // Susun format data Excel yang rapi
      const excelRows = filteredTransactions.map((t, idx) => ({
        No: idx + 1,
        Waktu: t.time || "-",
        Barcode: t.barcode,
        "Nama Produk": t.product,
        Tipe: t.type === "in" ? "Masuk (In)" : "Keluar (Out)",
        Jumlah: t.quantity,
        "Stok Awal": t.prevStock,
        "Stok Akhir": t.currentStock,
        Petugas: t.user || "-",
        Scanner: t.scanner || "-",
      }))

      if (excelRows.length === 0) {
        throw new Error(t("No data available for the selected filter."))
      }

      // Export ke spreadsheet .xlsx
      const worksheet = XLSX.utils.json_to_sheet(excelRows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi")

      XLSX.writeFile(workbook, `Laporan-Inventaris-${formatLocalDate(new Date())}.xlsx`)
    } catch (error) {
      console.error("Report export failed:", error)
      setExportError(
        error instanceof Error ? error.message : "Report export failed."
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Category")}
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-w-44 px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option value={ALL_CATEGORIES}>{t("All Categories")}</option>
              {categories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Date range")}
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="min-w-44 px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">{t("All dates")}</option>
              <option value="7">{t("Last 7 days")}</option>
              <option value="30">{t("Last 30 days")}</option>
              <option value="custom">{t("Custom")}</option>
            </select>
          </label>
          {dateRange === "custom" && (
            <>
              <label className="flex flex-col gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                {t("From")}
                <input type="date" value={customFrom} max={customTo || undefined} onChange={(event) => setCustomFrom(event.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-body" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                {t("To")}
                <input type="date" value={customTo} min={customFrom || undefined} onChange={(event) => setCustomTo(event.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-body" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
              </label>
            </>
          )}
          <button
            onClick={exportReport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body disabled:opacity-60"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {exporting ? t("Exporting...") : `↓ ${t("Export Report")}`}
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {t("Filter category and date range before exporting.")}
          {dateRange !== "all" && ` ${t("Transactions without a recorded date are excluded when a date filter is selected.")}`}
        </p>
        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {t("All recorded activity")} · {data.transactions.length} {language === "id" ? "transaksi" : "transactions"}
        </span>
      </div>
      {exportError && (
        <p role="alert" className="text-sm font-semibold" style={{ color: "var(--danger)" }}>
          {t(exportError)}
        </p>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: t("Total Stock In"),
            value: String(totalIn),
            icon: "↑",
            color: "var(--success)",
          },
          {
            label: t("Total Stock Out"),
            value: String(totalOut),
            icon: "↓",
            color: "var(--danger)",
          },
          {
            label: t("Net Movement"),
            value: `${totalIn - totalOut > 0 ? "+" : ""}${totalIn - totalOut}`,
            icon: "≡",
            color: "var(--info)",
          },
          {
            label: t("Total Transactions"),
            value: String(data.transactions.length),
            icon: "◎",
            color: "var(--primary)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" style={{ color: s.color }}>
                {s.icon}
              </span>
              <span
                className="text-xs font-body"
                style={{ color: "var(--muted-foreground)" }}
              >
                {s.label}
              </span>
            </div>
            <div
              className="font-display font-bold text-2xl"
              style={{ color: "var(--foreground)" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h2
          className="font-display font-semibold text-base mb-4"
          style={{ color: "var(--foreground)" }}
        >
          {t("Stock In vs Stock Out")}
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
              }}
            />
            <Bar
              dataKey="in"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              name={t("Stock In")}
            />
            <Bar
              dataKey="out"
              fill="#D9534F"
              radius={[4, 4, 0, 0]}
              name={t("Stock Out")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h2
          className="font-display font-semibold text-base mb-4"
          style={{ color: "var(--foreground)" }}
        >
          {t("Top Moving Products")}
        </h2>
        <div className="flex flex-col gap-3">
          {movements.map(({ product, quantity }, i) => {
            return (
              <div key={product.id} className="flex items-center gap-3">
                <span
                  className="text-xs font-mono w-5 text-right"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span
                      className="text-xs font-semibold font-body truncate"
                      style={{ color: "var(--foreground)" }}
                    >
                      {product.name}
                    </span>
                    <span
                      className="text-xs font-mono ml-2"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {quantity} {t("moved")}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--muted)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(quantity / maxMovement) * 100}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}