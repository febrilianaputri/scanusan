import { useState } from "react"
import { useAppData } from "../data/AppDataContext"
import type { User, UserRole } from "../types"
import { useLanguage } from "../i18n"

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (role: "admin" | "operator") => void;
}

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const { t } = useLanguage()
  const [role, setRole] = useState<"admin" | "operator">(user.role)

  const handleSave = () => {
    onSave(role)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-md overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-semibold text-base" style={{ color: "var(--foreground)" }}>
            {t("Edit")} - {user.name}
          </h2>
          <button onClick={onClose} className="text-lg" style={{ color: "var(--muted-foreground)" }}>✕</button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: "var(--muted-foreground)" }}>
              {t("Role")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "operator")}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option value="operator">{t("Operator")}</option>
              <option value="admin">{t("Admin")}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {t("Save Changes")}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ResetPasswordModalProps {
  user: User;
  onClose: () => void;
}

function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
  const { t } = useLanguage()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleReset = () => {
    setError("")
    if (password.length < 12) {
      setError("Kata sandi minimal 12 karakter.")
      return
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.")
      return
    }
    alert(t("Password successfully reset for {name}").replace("{name}", user.name))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-md overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-semibold text-base" style={{ color: "var(--foreground)" }}>
            {t("Reset Password")} - {user.name}
          </h2>
          <button onClick={onClose} className="text-lg" style={{ color: "var(--muted-foreground)" }}>✕</button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: "var(--muted-foreground)" }}>
              {t("New password for {name} (minimum 12 characters)").replace("{name}", user.name)}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: "var(--muted-foreground)" }}>
              {t("Re-enter the new password to confirm")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
          {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{t(error)}</p>}
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {t("Reset Password")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Users({ role }: { role: UserRole }) {
  const { t } = useLanguage()
  const { data, setData } = useAppData()

  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [resettingUser, setResettingUser] = useState<User | null>(null)

  if (role !== "admin") {
    return (
      <div role="alert" className="rounded-xl p-4 text-sm" style={{ background: "var(--card)", color: "var(--danger)" }}>
        {t("403 — You do not have permission to manage users.")}
      </div>
    )
  }

  const addUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")
    const newRole = form.get("role") as "admin" | "operator"

    if (!name || !email || password.length < 12) {
      setError("Periksa data. Kata sandi minimal 12 karakter.")
      return
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: newRole,
      status: "active",
      lastActivity: "Just now",
    }

    setData((current) => ({ ...current, users: [...current.users, newUser] }))
    formElement.reset()
    setShowAddForm(false)
    setError("")
  }

  const handleUpdateRole = (newRole: "admin" | "operator") => {
    if (!editingUser) return
    setData((current) => ({
      ...current,
      users: current.users.map((u) => u.id === editingUser.id ? { ...u, role: newRole } : u),
    }))
    setEditingUser(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setShowAddForm((open) => !open); setError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {showAddForm ? t("Cancel") : `+ ${t("Add User")}`}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={addUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <label className="flex flex-col gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Employee name")}
            <input name="name" required autoComplete="name" className="rounded-lg px-3 py-2 text-sm font-normal" style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Email")}
            <input name="email" type="email" required autoComplete="email" className="rounded-lg px-3 py-2 text-sm font-normal" style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Initial password (12-72 UTF-8 bytes)")}
            <input name="password" type="password" required minLength={12} autoComplete="new-password" className="rounded-lg px-3 py-2 text-sm font-normal" style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
            {t("Role")}
            <select name="role" defaultValue="operator" className="rounded-lg px-3 py-2 text-sm font-normal" style={{ background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              <option value="operator">{t("Operator")}</option>
              <option value="admin">{t("Admin")}</option>
            </select>
          </label>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            {error && <p role="alert" className="text-xs" style={{ color: "var(--danger)" }}>{t(error)}</p>}
            <button type="submit" className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              {t("Create employee account")}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                {["User", "Email", "Role", "Status", "Last Activity", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                    {t(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
                        {u.name[0]}
                      </div>
                      <span className="font-semibold" style={{ color: "var(--foreground)" }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={u.role === "admin" ? { background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" } : { background: "rgba(141,110,99,0.15)", color: "var(--brown)" }}>
                      {u.role === "admin" ? `⚡ ${t("Admin")}` : `👤 ${t("Operator")}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={u.status === "active" ? { background: "rgba(106,168,79,0.12)", color: "var(--success)" } : { background: "rgba(154,143,135,0.15)", color: "var(--muted-foreground)" }}>
                      {t(u.status === "active" ? "Active" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{u.lastActivity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditingUser(u)} className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: "var(--muted)", color: "var(--primary)" }}>
                        {t("Edit")}
                      </button>
                      <button onClick={() => setResettingUser(u)} className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: "var(--muted)", color: "var(--primary)" }}>
                        {t("Reset Password")}
                      </button>
                      <button
                        onClick={() => {
                          if (u.status === "inactive" || !window.confirm(t("Deactivate user?").replace("{name}", u.name))) return
                          setData((current) => ({
                            ...current,
                            users: current.users.map((item) => item.id === u.id ? { ...item, status: "inactive" } : item),
                          }))
                        }}
                        disabled={u.status === "inactive"}
                        className="px-2 py-1 rounded-lg text-xs font-semibold disabled:opacity-50"
                        style={{ background: "rgba(217,83,79,0.1)", color: "var(--danger)" }}
                      >
                        {t("Disable")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateRole}
        />
      )}

      {resettingUser && (
        <ResetPasswordModal
          user={resettingUser}
          onClose={() => setResettingUser(null)}
        />
      )}
    </div>
  )
}