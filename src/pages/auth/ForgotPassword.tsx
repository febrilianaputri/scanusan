import type { AuthPage, Theme } from "../../types"

interface ForgotPasswordProps {
  theme: Theme

  onThemeToggle: () => void

  onNavigate: (page: AuthPage) => void
}

export default function ForgotPassword({
  theme,
  onThemeToggle,
  onNavigate,
}: ForgotPasswordProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: "var(--primary)" }}
            >
              KI
            </div>
            <span
              className="font-display font-bold text-base"
              style={{ color: "var(--foreground)" }}
            >
              KAMI Inventory
            </span>
          </div>
          <button
            onClick={onThemeToggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-body"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀ Light"}
          </button>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
            style={{
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            }}
          >
            🔑
          </div>
          <h1
            className="font-display font-bold text-2xl mb-2"
            style={{ color: "var(--foreground)" }}
          >
            Reset kata sandi
          </h1>
          <p
            className="text-sm font-body"
            style={{ color: "var(--muted-foreground)" }}
          >
            Untuk menjaga akun pegawai tetap terpusat, hubungi Administrator
            untuk mengatur ulang kata sandi.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="w-full mt-6 py-3 rounded-xl text-sm font-semibold font-body"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  )
}
