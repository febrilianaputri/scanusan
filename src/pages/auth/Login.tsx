import { useState } from "react"

import AuthBackground from "../../components/AuthBackground"

import type { AuthPage, Theme } from "../../types"

import { ApiError } from "../../lib/api"

type LoginState = "default" | "loading" | "error" | "success"

interface LoginProps {
  theme: Theme

  onThemeToggle: () => void

  onNavigate: (page: AuthPage) => void

  onLogin: (email: string, password: string, remember: boolean) => Promise<void>
}

export default function Login({
  theme,
  onThemeToggle,
  onNavigate,
  onLogin,
}: LoginProps) {
  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [showPw, setShowPw] = useState(false)

  const [remember, setRemember] = useState(false)

  const [state, setState] = useState<LoginState>("default")

  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.")
      setState("error")
      return
    }

    setState("loading")

    setErrorMsg("")

    try {
      await onLogin(email.trim(), password, remember)

      setState("success")
    } catch (error) {
      setState("error")

      if (error instanceof ApiError && error.status === 403) {
        setErrorMsg("Akun ini belum aktif. Hubungi Administrator.")
      } else if (error instanceof ApiError && error.status >= 500) {
        setErrorMsg("Layanan server sedang bermasalah. Coba lagi nanti.")
      } else if (
        error instanceof Error &&
        error.message.includes("Firebase client configuration")
      ) {
        setErrorMsg(
          "Konfigurasi Firebase belum tersedia. Hubungi Administrator.",
        )
      } else if (error instanceof TypeError) {
        setErrorMsg(
          "Layanan autentikasi tidak dapat dijangkau. Periksa koneksi Anda.",
        )
      } else {
        setErrorMsg(
          "Login gagal. Periksa email dan kata sandi, lalu coba lagi.",
        )
      }

      console.error("Login failed:", error)
    }
  }

  return (
    <AuthBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                style={{ background: "var(--primary)" }}
              >
                KI
              </div>
              <span className="font-display font-bold text-lg text-white">
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
        </div>

        {/* Right — form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: "var(--primary)" }}
            >
              KI
            </div>
            <span className="font-display font-bold text-lg text-white">
              KAMI Inventory
            </span>
          </div>

          <div
            className="w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md"
            style={{
              background: "color-mix(in srgb, var(--card) 88%, transparent)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Theme toggle */}
            <div className="flex justify-end mb-6"></div>

            <h1
              className="font-display font-bold text-2xl mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Welcome Back
            </h1>
            <p
              className="text-sm font-body mb-7"
              style={{ color: "var(--muted-foreground)" }}
            >
              Sign in to your inventory dashboard
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5 font-body"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setState("default")
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                  style={{
                    background: "var(--card)",

                    border: `1px solid ${
                      state === "error" ? "var(--danger)" : "var(--border)"
                    }`,

                    color: "var(--foreground)",
                  }}
                  onFocus={(e) => {
                    if (state !== "error")
                      e.target.style.borderColor = "var(--primary)"
                  }}
                  onBlur={(e) => {
                    if (state !== "error")
                      e.target.style.borderColor = "var(--border)"
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5 font-body"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setState("default")
                    }}
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm font-body outline-none transition-all"
                    style={{
                      background: "var(--card)",

                      border: `1px solid ${
                        state === "error" ? "var(--danger)" : "var(--border)"
                      }`,

                      color: "var(--foreground)",
                    }}
                    onFocus={(e) => {
                      if (state !== "error")
                        e.target.style.borderColor = "var(--primary)"
                    }}
                    onBlur={(e) => {
                      if (state !== "error")
                        e.target.style.borderColor = "var(--border)"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {state === "error" && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                  style={{
                    background: "rgba(217,83,79,0.1)",
                    border: "1px solid rgba(217,83,79,0.3)",
                    color: "var(--danger)",
                  }}
                >
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Success */}
              {state === "success" && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                  style={{
                    background: "rgba(106,168,79,0.1)",
                    border: "1px solid rgba(106,168,79,0.3)",
                    color: "var(--success)",
                  }}
                >
                  ✓ Login successful — redirecting...
                </div>
              )}

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="accent-green-600"
                  />
                  <span
                    className="text-xs font-body"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-xs font-semibold font-body"
                  style={{ color: "var(--primary)" }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={state === "loading" || state === "success"}
                className="w-full py-3 rounded-xl text-sm font-semibold font-body transition-all"
                style={{
                  background:
                    state === "loading" || state === "success"
                      ? "var(--muted)"
                      : "var(--primary)",

                  color:
                    state === "loading" || state === "success"
                      ? "var(--muted-foreground)"
                      : "var(--primary-foreground)",

                  cursor: state === "loading" ? "not-allowed" : "pointer",
                }}
              >
                {state === "loading"
                  ? "Signing in..."
                  : state === "success"
                    ? "✓ Login successful"
                    : "Sign In"}
              </button>
            </form>

            <p
              className="text-center text-xs font-body mt-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              Akun pegawai dibuat oleh Administrator.
            </p>
          </div>
        </div>
      </div>
    </AuthBackground>
  )
}
