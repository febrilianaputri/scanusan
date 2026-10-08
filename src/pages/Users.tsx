import { useState } from "react"

import { useAppData } from "../data/AppDataContext"

import type { User, UserRole } from "../types"

import { apiRequest } from "../lib/api"

export default function Users({ role }: { role: UserRole }) {
  const { data, refreshUsers, replaceUsers } = useAppData()

  const [showAddForm, setShowAddForm] = useState(false)

  const [error, setError] = useState("")

  if (role !== "admin") {
    return (
      <div
        role="alert"
        className="rounded-xl p-4 text-sm"
        style={{ background: "var(--card)", color: "var(--danger)" }}
      >
        403 — Anda tidak memiliki izin untuk mengelola pengguna.
      </div>
    )
  }

  const addUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget

    const form = new FormData(formElement)

    const name = String(form.get("name") ?? "").trim()

    const email = String(form.get("email") ?? "").trim()

    const password = String(form.get("password") ?? "")

    const newRole = form.get("role")

    if (
      !name ||
      !email ||
      password.length < 12 ||
      new TextEncoder().encode(password).length > 72 ||
      (newRole !== "admin" && newRole !== "operator")
    ) {
      setError("Periksa data. Kata sandi harus 12 hingga 72 byte UTF-8.")

      return
    }

    try {
      const result = await apiRequest<{ user: User }>("/api/users", {
        method: "POST",

        body: JSON.stringify({ name, email, password, role: newRole }),
      })

      replaceUsers([...data.users, result.user])

      formElement.reset()

      setShowAddForm(false)

      setError("")
    } catch (createError) {
      console.error("Unable to create employee account:", createError)

      setError(
        createError instanceof Error
          ? createError.message
          : "Akun gagal dibuat.",
      )
    }
  }

  const editUser = async (user: User) => {
    const newRole = window
      .prompt("Role: admin or operator", user.role)
      ?.trim()
      .toLowerCase()

    if (newRole !== "admin" && newRole !== "operator") return

    try {
      await apiRequest(`/api/users/${encodeURIComponent(user.id)}`, {
        method: "PATCH",

        body: JSON.stringify({ role: newRole }),
      })

      await refreshUsers()
    } catch (updateError) {
      console.error("Unable to update employee role:", updateError)

      setError(
        updateError instanceof Error
          ? updateError.message
          : "Perubahan role gagal disimpan.",
      )
    }
  }

  const resetUserPassword = async (user: User) => {
    const password = window.prompt(
      `New password for ${user.name} (minimum 12 characters)`,
    )

    if (password === null) return

    if (
      password.length < 12 ||
      new TextEncoder().encode(password).length > 72
    ) {
      setError("Kata sandi harus 12 hingga 72 byte UTF-8.")

      return
    }

    if (window.prompt("Re-enter the new password to confirm") !== password) {
      setError("Konfirmasi kata sandi tidak cocok.")

      return
    }

    try {
      await apiRequest<void>(
        `/api/users/${encodeURIComponent(user.id)}/reset-password`,
        {
          method: "POST",

          body: JSON.stringify({ password }),
        },
      )

      setError("")
    } catch (resetError) {
      console.error("Unable to reset employee password:", resetError)

      setError(
        resetError instanceof Error
          ? resetError.message
          : "Reset kata sandi gagal.",
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowAddForm((open) => !open)
            setError("")
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {showAddForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={addUser}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl p-5"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <label
            className="flex flex-col gap-1.5 text-xs font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            Nama pegawai
            <input
              name="name"
              required
              autoComplete="name"
              className="rounded-lg px-3 py-2 text-sm font-normal"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
          </label>
          <label
            className="flex flex-col gap-1.5 text-xs font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg px-3 py-2 text-sm font-normal"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
          </label>
          <label
            className="flex flex-col gap-1.5 text-xs font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            Kata sandi awal (12-72 byte UTF-8)
            <input
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={72}
              autoComplete="new-password"
              className="rounded-lg px-3 py-2 text-sm font-normal"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
          </label>
          <label
            className="flex flex-col gap-1.5 text-xs font-semibold"
            style={{ color: "var(--muted-foreground)" }}
          >
            Role
            <select
              name="role"
              defaultValue="operator"
              className="rounded-lg px-3 py-2 text-sm font-normal"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            {error && (
              <p
                role="alert"
                className="text-xs"
                style={{ color: "var(--danger)" }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Buat akun pegawai
            </button>
          </div>
        </form>
      )}
      {error && !showAddForm && (
        <p
          role="alert"
          className="rounded-xl p-3 text-sm"
          style={{ color: "var(--danger)", background: "var(--card)" }}
        >
          {error}
        </p>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr
                style={{
                  background: "var(--muted)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {[
                  "User",
                  "Email",
                  "Role",
                  "Status",
                  "Last Activity",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr
                  key={u.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--muted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: "var(--primary)" }}
                      >
                        {u.name[0]}
                      </div>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={
                        u.role === "admin"
                          ? {
                              background:
                                "color-mix(in srgb, var(--primary) 15%, transparent)",
                              color: "var(--primary)",
                            }
                          : {
                              background: "rgba(141,110,99,0.15)",
                              color: "var(--brown)",
                            }
                      }
                    >
                      {u.role === "admin" ? "⚡ Admin" : "👤 Operator"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={
                        u.status === "active"
                          ? {
                              background: "rgba(106,168,79,0.12)",
                              color: "var(--success)",
                            }
                          : {
                              background: "rgba(154,143,135,0.15)",
                              color: "var(--muted-foreground)",
                            }
                      }
                    >
                      {u.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {u.lastActivity}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => editUser(u)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: "var(--muted)",
                          color: "var(--primary)",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => resetUserPassword(u)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: "var(--muted)",
                          color: "var(--primary)",
                        }}
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            u.status === "inactive" ||
                            !window.confirm(`Deactivate ${u.name}?`)
                          )
                            return

                          try {
                            await apiRequest(
                              `/api/users/${encodeURIComponent(u.id)}`,
                              {
                                method: "PATCH",

                                body: JSON.stringify({ status: "inactive" }),
                              },
                            )

                            await refreshUsers()
                          } catch (disableError) {
                            console.error(
                              "Unable to deactivate employee:",
                              disableError,
                            )

                            setError(
                              disableError instanceof Error
                                ? disableError.message
                                : "Akun gagal dinonaktifkan.",
                            )
                          }
                        }}
                        disabled={u.status === "inactive"}
                        className="px-2 py-1 rounded-lg text-xs font-semibold disabled:opacity-50"
                        style={{
                          background: "rgba(217,83,79,0.1)",
                          color: "var(--danger)",
                        }}
                      >
                        Disable
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          {
            role: "Admin",
            icon: "⚡",
            desc: "Full system access — products, transactions, scanners, users, settings",
            color: "var(--primary)",
          },

          {
            role: "Operator",
            icon: "👤",
            desc: "Inventory and transaction access — scan, stock in/out, view reports",
            color: "var(--brown)",
          },
        ].map((r) => (
          <div
            key={r.role}
            className="rounded-2xl p-4 flex gap-3"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <span className="text-xl">{r.icon}</span>
            <div>
              <div
                className="font-display font-semibold text-sm"
                style={{ color: r.color }}
              >
                {r.role}
              </div>
              <div
                className="text-xs font-body mt-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                {r.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
