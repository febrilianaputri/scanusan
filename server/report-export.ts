import ExcelJS from "exceljs"

export interface ReportTransaction {
  createdAt?: string
  time: string
  barcode: string
  product: string
  type: "in" | "out"
  quantity: number
  prevStock: number
  currentStock: number
  scanner: string
  user: string
}

export function filterReportTransactions(
  transactions: readonly ReportTransaction[],
  categoryByBarcode: ReadonlyMap<string, string>,
  filters: { category?: string; from?: string; to?: string },
) {
  return transactions.filter((transaction) => {
    const transactionCategory =
      categoryByBarcode.get(transaction.barcode) ?? ""
    const categoryMatches =
      filters.category === undefined ||
      transactionCategory === filters.category
    const transactionDate = transaction.createdAt?.slice(0, 10)
    const dateMatches =
      filters.from === undefined ||
      (filters.to !== undefined &&
        transactionDate !== undefined &&
        transactionDate >= filters.from &&
        transactionDate <= filters.to)
    return categoryMatches && dateMatches
  })
}

export async function createReportWorkbook(
  transactions: readonly ReportTransaction[],
  categoryByBarcode: ReadonlyMap<string, string>,
) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Inventory Report")
  const header = [
    "Date",
    "Time",
    "Barcode",
    "Product",
    "Category",
    "Type",
    "Quantity",
    "Previous Stock",
    "Current Stock",
    "Scanner",
    "User",
  ]
  worksheet.addRow(header)

  for (const transaction of transactions) {
    worksheet.addRow([
      transaction.createdAt?.slice(0, 10) ?? "",
      transaction.time,
      transaction.barcode,
      transaction.product,
      categoryByBarcode.get(transaction.barcode) ?? "",
      transaction.type,
      transaction.quantity,
      transaction.prevStock,
      transaction.currentStock,
      transaction.scanner,
      transaction.user,
    ])
  }

  const border = {
    top: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
    left: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
    bottom: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
    right: { style: "thin" as const, color: { argb: "FFD1D5DB" } },
  }

  worksheet.getRow(1).height = 22
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF176B52" },
    }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    cell.border = border
  })

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = border
      cell.alignment = { vertical: "middle" }
    })
  })

  worksheet.columns.forEach((column, columnIndex) => {
    let width = 12
    worksheet.eachRow((row) => {
      width = Math.max(
        width,
        String(row.getCell(columnIndex + 1).value ?? "").length + 2,
      )
    })
    column.width = Math.min(width, 40)
  })

  worksheet.views = [{ state: "frozen", ySplit: 1 }]
  return Buffer.from(await workbook.xlsx.writeBuffer())
}
