import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

export type Language = "en" | "id"

const translations: Record<string, string> = {
  MAIN: "UTAMA",
  MONITORING: "PEMANTAUAN",
  MANAGEMENT: "MANAJEMEN",
  "Inventory Management": "Manajemen Inventaris",
  Administrator: "Administrator",
  Operator: "Operator",
  Inventory: "Inventaris",
  Transactions: "Transaksi",
  Reports: "Laporan",
  Suppliers: "Pemasok",
  Users: "Pengguna",
  Settings: "Pengaturan",
  "My Profile": "Profil Saya",
  "Account Settings": "Pengaturan Akun",
  "Stock Transaction": "Transaksi Stok",
  "Scan Activity": "Aktivitas Pemindaian",
  Dashboard: "Dasbor",
  "Overview of your inventory and scanner activity":
    "Ringkasan inventaris dan aktivitas pemindai",
  "Manage products and current stock levels":
    "Kelola produk dan tingkat stok saat ini",
  "Track every inventory movement": "Lacak setiap pergerakan inventaris",
  "Scan and process inventory movements":
    "Pindai dan proses pergerakan inventaris",
  "Monitor connected barcode scanning devices":
    "Pantau perangkat pemindai barcode yang terhubung",
  "Inventory activity overview": "Ringkasan aktivitas inventaris",
  "Manage supplier relationships": "Kelola hubungan dengan pemasok",
  "Manage system users and roles": "Kelola pengguna dan peran sistem",
  "System configuration and preferences": "Konfigurasi dan preferensi sistem",
  "Manage your personal information": "Kelola informasi pribadi Anda",
  "Preferences, security, and notifications":
    "Preferensi, keamanan, dan notifikasi",
  Online: "Online",
  Offline: "Offline",
  View: "Lihat",
  "Find a page...": "Cari halaman...",
  "Search pages": "Cari halaman",
  Dark: "Gelap",
  Light: "Terang",
  Notifications: "Notifikasi",
  "No active inventory alerts.": "Tidak ada peringatan inventaris aktif.",
  "Open inventory": "Buka inventaris",
  "Sign out?": "Keluar?",
  "Are you sure you want to sign out of your account?":
    "Apakah Anda yakin ingin keluar dari akun?",
  Cancel: "Batal",
  "Sign Out": "Keluar",
  Products: "Produk",
  "Stock In": "Stok Masuk",
  "Stock Out": "Stok Keluar",
  "Low Stock": "Stok Menipis",
  "Out of Stock": "Stok Habis",
  "In inventory": "Di inventaris",
  "Recorded quantity": "Jumlah tercatat",
  "Needs restocking": "Perlu diisi ulang",
  Unavailable: "Tidak tersedia",
  "Recent Stock Movement": "Pergerakan Stok Terbaru",
  "Recent Transactions": "Transaksi Terbaru",
  All: "Semua",
  "Search product or barcode...": "Cari produk atau barcode...",
  "All Scanners": "Semua Pemindai",
  "All Users": "Semua Pengguna",
  Time: "Waktu",
  Barcode: "Barcode",
  Product: "Produk",
  Type: "Jenis",
  Qty: "Jumlah",
  "Prev Stock": "Stok Sebelumnya",
  "Current Stock": "Stok Saat Ini",
  Scanner: "Pemindai",
  User: "Pengguna",
  Category: "Kategori",
  "All Categories": "Semua Kategori",
  "Date range": "Rentang tanggal",
  "All dates": "Semua tanggal",
  "Last 7 days": "7 hari terakhir",
  "Last 30 days": "30 hari terakhir",
  Custom: "Kustom",
  From: "Dari",
  To: "Sampai",
  "Export Report": "Ekspor Laporan",
  "Exporting...": "Mengekspor...",
  "Filter category and date range before exporting.":
    "Pilih kategori dan rentang tanggal sebelum mengekspor.",
  "Transactions without a recorded date are excluded when a date filter is selected.":
    "Transaksi tanpa tanggal tercatat tidak disertakan saat filter tanggal dipilih.",
  "Please select a valid date range.": "Pilih rentang tanggal yang valid.",
  "No transactions match the selected filters.":
    "Tidak ada transaksi yang cocok dengan filter.",
  "All recorded activity": "Semua aktivitas tercatat",
  "Total Stock In": "Total Stok Masuk",
  "Total Stock Out": "Total Stok Keluar",
  "Net Movement": "Pergerakan Bersih",
  "Total Transactions": "Total Transaksi",
  "Stock In vs Stock Out": "Stok Masuk vs Stok Keluar",
  "Top Moving Products": "Produk dengan Pergerakan Tertinggi",
  "moved": "bergerak",
  "WiFi Signal": "Sinyal WiFi",
  "Last Scan": "Pemindaian Terakhir",
  "Total Scans": "Total Pemindaian",
  "IP Address": "Alamat IP",
  Uptime: "Waktu Aktif",
  Good: "Baik",
  Low: "Rendah",
  "Last seen": "Terakhir terlihat",
  "Device is unreachable. Check power and network.":
    "Perangkat tidak dapat dijangkau. Periksa daya dan jaringan.",
  "Live Scan Activity": "Aktivitas Pemindaian Langsung",
  New: "Baru",
  "Waiting for barcode...": "Menunggu barcode...",
  "Point your IoT scanner at a product barcode":
    "Arahkan pemindai IoT ke barcode produk",
  "Connected • Ready to scan": "Terhubung • Siap memindai",
  "Scanning...": "Memindai...",
  "Barcode Detected": "Barcode Terdeteksi",
  "No Scannable Stock": "Tidak Ada Stok untuk Dipindai",
  "Add an in-stock product before simulating a scan.":
    "Tambahkan produk yang tersedia sebelum menyimulasikan pemindaian.",
  "Simulate Scan": "Simulasikan Pemindaian",
  Reset: "Atur Ulang",
  "Edit Product": "Edit Produk",
  "Add New Product": "Tambah Produk Baru",
  "Product Name": "Nama Produk",
  "Minimum Stock": "Stok Minimum",
  "Initial Stock": "Stok Awal",
  Location: "Lokasi",
  Supplier: "Pemasok",
  Unit: "Satuan",
  Battery: "Baterai",
  Today: "Hari ini",
  Local: "Lokal",
  Active: "Aktif",
  "Search products...": "Cari produk...",
  "Add Product": "Tambah Produk",
  Edit: "Ubah",
  Delete: "Hapus",
  "Delete product?": "Hapus produk {name}?",
  Showing: "Menampilkan",
  of: "dari",
  products: "produk",
  Out: "Habis",
  Actions: "Tindakan",
  "Min Stock": "Stok Minimum",
  "LIVE SCAN": "PEMINDAIAN LANGSUNG",
  "Demo Scanner": "Pemindai Demo",
  "Waiting for barcode scan...": "Menunggu pemindaian barcode...",
  "STOCK OUT": "STOK KELUAR",
  "Scan or enter barcode": "Pindai atau masukkan barcode",
  "Product barcode": "Barcode produk",
  Quantity: "Jumlah",
  "New Stock": "Stok Baru",
  "Confirm Stock": "Konfirmasi Stok",
  "Stock": "Stok",
  In: "Masuk",
  "SCANNING...": "MEMINDAI...",
  "Akun ini belum aktif. Hubungi Administrator.":
    "This account is inactive. Contact an Administrator.",
  "Layanan server sedang bermasalah. Coba lagi nanti.":
    "The server is having problems. Please try again later.",
  "Konfigurasi Firebase belum tersedia. Hubungi Administrator.":
    "Firebase configuration is unavailable. Contact an Administrator.",
  "Layanan autentikasi tidak dapat dijangkau. Periksa koneksi Anda.":
    "The authentication service is unreachable. Check your connection.",
  "403 — Anda tidak memiliki izin untuk membuka halaman ini.":
    "403 — You do not have permission to open this page.",
  "Laporan gagal diekspor.": "Report export failed.",
  "Type or scan barcode, then press Enter":
    "Ketik atau pindai barcode, lalu tekan Enter",
  "A connected scanner can type directly into this field.":
    "Pemindai yang terhubung dapat mengetik langsung pada kolom ini.",
  "Save Changes": "Simpan Perubahan",
  "Save Product": "Simpan Produk",
  "Please fill in all fields.": "Harap isi semua kolom.",
  "Login failed. Check your email and password, then try again.":
    "Login gagal. Periksa email dan kata sandi, lalu coba lagi.",
  "Welcome Back": "Selamat Datang Kembali",
  "Sign in to your inventory dashboard":
    "Masuk ke dasbor inventaris Anda",
  "Email Address": "Alamat Email",
  "Enter your email": "Masukkan email",
  Password: "Kata Sandi",
  "Enter your password": "Masukkan kata sandi",
  "Forgot Password?": "Lupa Kata Sandi?",
  "Remember me": "Ingat saya",
  "Sign In": "Masuk",
  "Reset kata sandi": "Reset kata sandi",
  "Kembali ke Login": "Kembali ke Login",
  "Memeriksa sesi aman...": "Checking secure session...",
  "Memuat data dari server...": "Loading data from server...",
  "Logout gagal. Koneksi ke server diperlukan untuk mengakhiri sesi.":
    "Sign out failed. A server connection is required to end the session.",
  "Gagal terhubung ke database Firebase.":
    "Failed to connect to the Firebase database.",
  "Perubahan gagal disimpan ke database cloud.":
    "Changes could not be saved to the cloud database.",
  "Gagal mengambil data profil dari Firebase Firestore.":
    "Failed to load the user profile from Firebase Firestore.",
  "Gagal mengambil data dari Firebase": "Failed to load data from Firebase.",
  "403 — You do not have permission to manage users.":
    "403 — Anda tidak memiliki izin untuk mengelola pengguna.",
  "Employee name": "Nama pegawai",
  Email: "Email",
  "Initial password (12-72 UTF-8 bytes)":
    "Kata sandi awal (12-72 byte UTF-8)",
  Admin: "Admin",
  "Add User": "Tambah Pengguna",
  "Create employee account": "Buat akun pegawai",
  "Last Activity": "Aktivitas Terakhir",
  "Reset Password": "Atur Ulang Kata Sandi",
  "Deactivate user?": "Nonaktifkan pengguna {name}?",
  Disable: "Nonaktifkan",
  Role: "Peran",
  Status: "Status",
  "Akun gagal dibuat.": "The account could not be created.",
  "Perubahan role gagal disimpan.": "Failed to save the role change.",
  "Kata sandi harus 12 hingga 72 byte UTF-8.":
    "The password must be 12 to 72 UTF-8 bytes.",
  "Konfirmasi kata sandi tidak cocok.": "The password confirmation does not match.",
  "Reset kata sandi gagal.": "Failed to reset the password.",
  "Akun gagal dinonaktifkan.": "Failed to deactivate the account.",
  "Periksa data. Kata sandi harus 12 hingga 72 byte UTF-8.":
    "Check the details. Passwords must be 12 to 72 UTF-8 bytes.",
  "GENERAL": "UMUM",
  "INVENTORY": "INVENTARIS",
  "SCANNER": "PEMINDAI",
  "APPEARANCE": "TAMPILAN",
  "Company Name": "Nama Perusahaan",
  "Warehouse Name": "Nama Gudang",
  Timezone: "Zona Waktu",
  "Default Unit": "Satuan Default",
  "Low Stock Threshold": "Batas Stok Menipis",
  "Stock Alert": "Peringatan Stok",
  "Send notifications when stock is low":
    "Kirim notifikasi saat stok menipis",
  "Stock alert": "Peringatan stok",
  Connected: "Terhubung",
  "Scanner Timeout (seconds)": "Batas Waktu Pemindai (detik)",
  "API Endpoint": "Endpoint API",
  Theme: "Tema",
  "Settings saved on this device": "Pengaturan tersimpan di perangkat ini",
  "Save Settings": "Simpan Pengaturan",
  "Real-Time Feed": "Umpan Waktu Nyata",
  Successful: "Berhasil",
  Failed: "Gagal",
  "Active Scanners": "Pemindai Aktif",
  Action: "Tindakan",
  Result: "Hasil",
  "Supplier name": "Nama pemasok",
  "Contact email or phone": "Email atau telepon kontak",
  "No transactions yet": "Belum ada transaksi",
  "Add Supplier": "Tambah Pemasok",
  Contact: "Kontak",
  "Last Transaction": "Transaksi Terakhir",
  Inactive: "Tidak aktif",
  "Delete supplier?": "Hapus pemasok {name}?",
  "Personal Information": "Informasi Pribadi",
  "Edit Profile": "Ubah Profil",
  Saving: "Menyimpan",
  "Saving...": "Menyimpan...",
  Save: "Simpan",
  "Save Profile": "Simpan Profil",
  "Full Name": "Nama Lengkap",
  "Phone Number": "Nomor Telepon",
  Phone: "Telepon",
  Position: "Jabatan",
  Department: "Departemen",
  "Recent Activity": "Aktivitas Terbaru",
  "Profile saved.": "Profil tersimpan.",
  "✓ Profile updated successfully": "✓ Profil berhasil diperbarui",
  "Logged in": "Masuk",
  "Stock Out — CAT6 Cable": "Stok Keluar — Kabel CAT6",
  "Updated product — RJ45 Connector": "Produk diperbarui — Konektor RJ45",
  "Stock In — Fiber Optic Patch": "Stok Masuk — Fiber Optic Patch",
  "Generated report — Stock Movement": "Laporan dibuat — Pergerakan Stok",
  PROFILE: "PROFIL",
  SECURITY: "KEAMANAN",
  NOTIFICATIONS: "NOTIFIKASI",
  "Change Password": "Ubah Kata Sandi",
  "Hubungi Administrator untuk mengatur ulang kata sandi melalui manajemen akun.":
    "Contact an Administrator to reset your password through account management.",
  "Two-Factor Authentication": "Autentikasi Dua Faktor",
  "Add an extra layer of security to your account":
    "Tambahkan lapisan keamanan ekstra ke akun Anda",
  "Active Sessions": "Sesi Aktif",
  "Current session · Jakarta, ID": "Sesi saat ini · Jakarta, ID",
  "Email Notifications": "Notifikasi Email",
  "Receive activity summaries by email":
    "Terima ringkasan aktivitas melalui email",
  "Low Stock Alerts": "Peringatan Stok Menipis",
  "Get alerted when products fall below minimum":
    "Dapatkan peringatan saat stok produk di bawah batas minimum",
  "Scanner Offline Alerts": "Peringatan Pemindai Offline",
  "Notify when a scanner goes offline":
    "Beri tahu saat pemindai terputus",
  "Transaction Notifications": "Notifikasi Transaksi",
  "Notify on every stock movement": "Beri tahu setiap ada pergerakan stok",
  "DANGER ZONE": "ZONA BERBAHAYA",
  "Delete Account": "Hapus Akun",
  "Account deletion requires a configured identity service and is unavailable in this local demo.":
    "Penghapusan akun memerlukan layanan identitas yang dikonfigurasi dan tidak tersedia di demo lokal ini.",
  "Main Warehouse": "Gudang Utama",
  Excellent: "Sangat Baik",
  "WiFi": "WiFi",
  "Back to Login": "Kembali ke Login",
  "IoT Scanner": "Pemindai IoT",
  "Report export failed.": "Laporan gagal diekspor.",
  "Unable to load export categories.": "Kategori ekspor gagal dimuat.",
  "Invalid export filters": "Filter ekspor tidak valid",
  "This account is inactive. Contact an Administrator.":
    "Akun ini belum aktif. Hubungi Administrator.",
  "The server is having problems. Please try again later.":
    "Layanan server sedang bermasalah. Coba lagi nanti.",
  "Firebase configuration is unavailable. Contact an Administrator.":
    "Konfigurasi Firebase belum tersedia. Hubungi Administrator.",
  "The authentication service is unreachable. Check your connection.":
    "Layanan autentikasi tidak dapat dijangkau. Periksa koneksi Anda.",
  "Login successful — redirecting...": "Login berhasil — mengalihkan...",
  "Login successful": "Login berhasil",
  "Signing in...": "Sedang masuk...",
  "Employee accounts are created by an Administrator.":
    "Akun pegawai dibuat oleh Administrator.",
  "Requested": "Diminta",
  "but only": "tetapi hanya",
  available: "tersedia",
  "Insufficient Stock": "Stok Tidak Mencukupi",
  "Adjust Quantity": "Sesuaikan Jumlah",
  "Transaction Successful!": "Transaksi Berhasil!",
  "Product not found": "Produk tidak ditemukan",
  "Check the barcode or add the product to inventory first.":
    "Periksa barcode atau tambahkan produk ke inventaris terlebih dahulu.",
  "Scan Again": "Pindai Lagi",
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (text: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem("kami-inventory-language") === "id"
        ? "id"
        : "en"
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem("kami-inventory-language", language)
    } catch (error) {
      console.error("Unable to save language preference:", error)
    }
  }, [language])

  const value = {
    language,
    setLanguage,
    t: (text: string) => (language === "id" ? translations[text] ?? text : text),
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider")
  return context
}
