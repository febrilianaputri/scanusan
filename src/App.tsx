import { useEffect, useState } from "react"

import type { Theme, Page, AuthPage, AuthUser } from "./types"

import { AuthProvider, useAuth } from "./auth/AuthContext"

import Sidebar from "./components/Sidebar"

import Topbar from "./components/Topbar"

import Dashboard from "./pages/Dashboard"

import Inventory from "./pages/Inventory"

import Transactions from "./pages/Transactions"

import StockTransaction from "./pages/StockTransaction"

import IoTScanner from "./pages/IoTScanner"

import ScanActivity from "./pages/ScanActivity"

import Reports from "./pages/Reports"

import Suppliers from "./pages/Suppliers"

import Users from "./pages/Users"

import Settings from "./pages/Settings"

import Profile from "./pages/Profile"

import AccountSettings from "./pages/AccountSettings"

import Login from "./pages/auth/Login"

import ForgotPassword from "./pages/auth/ForgotPassword"

import { AppDataProvider, useAppData } from "./data/AppDataContext"

import { clearLegacyBrowserData } from "./lib/legacy-inventory"

const adminPages: Page[] = ["reports", "suppliers", "users", "settings"]

export default function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem("kami-inventory-theme") === "dark" ? "dark" : "light",
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")

    try {
      localStorage.setItem("kami-inventory-theme", theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    clearLegacyBrowserData()
  }, [])

  const toggleTheme = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"))

  return (
    <AuthProvider>
      <Application
        theme={theme}
        setTheme={setTheme}
        toggleTheme={toggleTheme}
      />
    </AuthProvider>
  )
}

function Application({
  theme,

  setTheme,

  toggleTheme,
}: {
  theme: Theme

  setTheme: (theme: Theme) => void

  toggleTheme: () => void
}) {
  const {
    user,
    checkingSession,
    connectionError,
    login,
    logout,
    updateProfile,
  } = useAuth()

  const [authPage, setAuthPage] = useState<AuthPage>("login")

  const [authError, setAuthError] = useState("")

  if (checkingSession) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "var(--background)",
          color: "var(--muted-foreground)",
        }}
      >
        Memeriksa sesi aman...
      </div>
    )
  }

  if (!user) {
    const authProps = {
      theme,
      onThemeToggle: toggleTheme,
      onNavigate: setAuthPage,
    }

    return (
      <div style={{ background: "var(--background)", minHeight: "100vh" }}>
        {(authError || connectionError) && (
          <p
            role="alert"
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50 rounded-lg p-3 text-sm"
            style={{ color: "var(--danger)", background: "var(--card)" }}
          >
            {authError || connectionError}
          </p>
        )}
        {authPage === "login" ? (
          <Login {...authProps} onLogin={login} />
        ) : (
          <ForgotPassword {...authProps} />
        )}
      </div>
    )
  }

  const handleLogout = async () => {
    setAuthError("")

    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)

      setAuthError(
        "Logout gagal. Koneksi ke server diperlukan untuk mengakhiri sesi.",
      )
    }
  }

  return (
    <AppDataProvider>
      <AuthenticatedApplication
        user={user}
        theme={theme}
        setTheme={setTheme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        onProfileUpdate={updateProfile}
        authError={authError || connectionError || ""}
      />
    </AppDataProvider>
  )
}

function AuthenticatedApplication({
  user,

  theme,

  setTheme,

  toggleTheme,

  onLogout,

  onProfileUpdate,

  authError,
}: {
  user: AuthUser

  theme: Theme

  setTheme: (theme: Theme) => void

  toggleTheme: () => void

  onLogout: () => void

  onProfileUpdate: (
    profile: Pick<AuthUser, "name" | "phone" | "position" | "department">,
  ) => Promise<void>

  authError: string
}) {
  const { error: dataError, loading: dataLoading } = useAppData()

  const [page, setPage] = useState<Page>("dashboard")

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (user.role !== "admin" && adminPages.includes(page)) setPage("dashboard")
  }, [user.role, page])

  const navigate = (nextPage: Page) => {
    if (adminPages.includes(nextPage) && user.role !== "admin") {
      setNotice("403 — Anda tidak memiliki izin untuk membuka halaman ini.")

      setPage("dashboard")

      return
    }

    setNotice("")

    setPage(nextPage)
  }

  const renderPage = () => {
    if (adminPages.includes(page) && user.role !== "admin") return <Dashboard />

    switch (page) {
      case "dashboard":
        return <Dashboard />

      case "inventory":
        return <Inventory />

      case "transactions":
        return <Transactions />

      case "stock-transaction":
        return <StockTransaction />

      case "iot-scanner":
        return <IoTScanner />

      case "scan-activity":
        return <ScanActivity />

      case "reports":
        return <Reports />

      case "suppliers":
        return <Suppliers />

      case "users":
        return <Users role={user.role} />

      case "settings":
        return <Settings theme={theme} onThemeChange={setTheme} />

      case "profile":
        return <Profile user={user} onUpdate={onProfileUpdate} />

      case "account-settings":
        return (
          <AccountSettings
            user={user}
            theme={theme}
            onThemeChange={setTheme}
            onUpdate={onProfileUpdate}
          />
        )

      default:
        return <Dashboard />
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={user.role}
      />

      <div className="lg:pl-60">
        <Topbar
          theme={theme}
          onThemeToggle={toggleTheme}
          currentPage={page}
          onMenuToggle={() => setSidebarOpen(true)}
          user={user}
          onNavigate={navigate}
          onLogout={onLogout}
        />

        <main className="pt-[70px] min-h-screen">
          <div className="p-6 lg:p-8">
            {(dataError || notice || authError) && (
              <div
                role="alert"
                className="mb-4 rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--danger)",
                }}
              >
                {dataError || notice || authError}
              </div>
            )}
            {dataLoading ? (
              <p
                className="text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                Memuat data dari server...
              </p>
            ) : (
              renderPage()
            )}
          </div>
        </main>
      </div>

      {page !== "stock-transaction" && (
        <button
          onClick={() => navigate("stock-transaction")}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm font-body transition-all hover:scale-105"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          <span className="text-lg">📡</span>
          Stock Transaction
        </button>
      )}
    </div>
  )
}
