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
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatNiceDateTime = (rawTime?: string) => {
    if (!rawTime) return "—"
    try {
      if (rawTime.includes("T")) {
        const d = new Date(rawTime)
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, "0")
          const month = String(d.getMonth() + 1).padStart(2, "0")
          const year = d.getFullYear()
          const hour = String(d.getHours()).padStart(2, "0")
          const minute = String(d.getMinutes()).padStart(2, "0")
          return `${day}/${month}/${year} ${hour}:${minute}`
        }
      }
      if (rawTime.length <= 8 && rawTime.includes(":")) {
        const today = new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        return `${today} ${rawTime}`
      }
    } catch (e) {}
    return rawTime
  }

  const getNormalizedDateTime = (t: { createdAt?: string; time?: string }) => {
    const raw = t.createdAt || t.time || ""
    if (!raw) return ""
    if (raw.length <= 8 && raw.includes(":")) {
      const todayStr = formatLocalDate(new Date())
      return `${todayStr} ${raw}`
    }
    return raw
  }

  // Kategori Dinamis & Case-Insensitive (menggabungkan huruf besar/kecil yang mirip seperti di Inventaris)
  const categoriesMap = useMemo(() => {
    const map = new Map<string, string>() // lowercase -> original formatted name
    data.products.forEach((p) => {
      if (p.category && p.category.trim() !== "") {
        const lower = p.category.toLowerCase().trim()
        if (!map.has(lower)) {
          map.set(lower, p.category.trim())
        }
      }
    })
    return map
  }, [data.products])

  const categories = useMemo(() => {
    return Array.from(categoriesMap.values())
  }, [categoriesMap])

  const filteredTransactions = useMemo(() => {
    let txs = [...data.transactions]

    // Filter berdasarkan kategori secara Case-Insensitive
    if (category !== ALL_CATEGORIES) {
      const targetLower = category.toLowerCase().trim()
      const productBarcodes = data.products
        .filter((p) => p.category && p.category.toLowerCase().trim() === targetLower)
        .map((p) => p.barcode)
      txs = txs.filter((t) => productBarcodes.includes(t.barcode))
    }

    if (typeFilter !== "all") {
      txs = txs.filter((t) => t.type === typeFilter)
    }

    if (dateRange === "custom") {
      if (customFrom && customTo) {
        txs = txs.filter((t) => {
          const fullDt = getNormalizedDateTime(t)
          if (!fullDt) return false
          const txDate = fullDt.split(" ")[0].split("T")[0]
          return txDate >= customFrom && txDate <= customTo
        })
      }
    } else if (dateRange !== "all") {
      const days = Number(dateRange)
      const today = new Date()
      const start = new Date(today)
      start.setDate(today.getDate() - days + 1)
      const fromStr = formatLocalDate(start)
      const toStr = formatLocalDate(today)

      txs = txs.filter((t) => {
        const fullDt = getNormalizedDateTime(t)
        if (!fullDt) return false
        const txDate = fullDt.split(" ")[0].split("T")[0]
        return txDate >= fromStr && txDate <= toStr
      })
    }

    return txs
  }, [data.transactions, data.products, category, typeFilter, dateRange, customFrom, customTo])

  const chartData = useMemo(() => {
    return filteredTransactions
      .slice(0, 7)
      .reverse()
      .map((transaction) => {
        const formatted = formatNiceDateTime(transaction.createdAt || transaction.time)
        let displayTime = formatted
        if (formatted.includes(" ")) {
          const [datePart, timePart] = formatted.split(" ")
          const [d, m] = datePart.split("/")
          displayTime = `${d}/${m} ${timePart}`
        }
        return {
          day: displayTime,
          in: transaction.type === "in" ? transaction.quantity : 0,
          out: transaction.type === "out" ? transaction.quantity : 0,
        }
      })
  }, [filteredTransactions])

  const totalIn = filteredTransactions
    .filter((transaction) => transaction.type === "in")
    .reduce((sum, transaction) => sum + transaction.quantity, 0)

  const totalOut = filteredTransactions
    .filter((transaction) => transaction.type === "out")
    .reduce((sum, transaction) => sum + transaction.quantity, 0)

  const movements = data.products
    .map((product) => ({
      product,
      quantity: filteredTransactions
        .filter((transaction) => transaction.barcode === product.barcode)
        .reduce((sum, transaction) => sum + transaction.quantity, 0),
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  const maxMovement = Math.max(1, ...movements.map((item) => item.quantity))

  const exportReport = () => {
    setExporting(true)
    setExportError("")

    try {
      if (filteredTransactions.length === 0) {
        throw new Error(t("No data available for the selected filter."))
      }

      const sortedForExport = [...filteredTransactions].sort((a, b) => {
        const timeA = getNormalizedDateTime(a)
        const timeB = getNormalizedDateTime(b)
        return timeA.localeCompare(timeB)
      })

      const excelRows = sortedForExport.map((t, idx) => ({
        No: idx + 1,
        Waktu: formatNiceDateTime(t.createdAt || t.time),
        Barcode: t.barcode,
        "Nama Produk": t.product,
        Tipe: t.type === "in" ? "Masuk (In)" : "Keluar (Out)",
        Jumlah: t.quantity,
        "Stok Awal": t.prevStock,
        "Stok Akhir": t.currentStock,
        Petugas: t.user || "-",
        Scanner: t.scanner || "-",
      }))

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
              className="min-w-36 px-3 py-2.5 rounded-xl text-sm font-body outline-none cursor-pointer"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option value={ALL_CATEGORIES}>{t("All Categories")}</option>
              {categories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Tipe Transaksi")}
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="min-w-36 px-3 py-2.5 rounded-xl text-sm font-body outline-none cursor-pointer"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">{t("Semua Tipe")}</option>
              <option value="in">{t("Stok Masuk Saja")}</option>
              <option value="out">{t("Stok Keluar Saja")}</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Date range")}
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="min-w-36 px-3 py-2.5 rounded-xl text-sm font-body outline-none cursor-pointer"
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body disabled:opacity-60 cursor-pointer"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {exporting ? t("Exporting...") : `↓ ${t("Export Report")}`}
          </button>
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {filteredTransactions.length} {language === "id" ? "transaksi ditemukan dari" : "transactions found from"} {data.transactions.length} {language === "id" ? "total transaksi" : "total transactions"}
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
            value: String(filteredTransactions.length),
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