import { useState } from "react"
import type { AuthUser, Theme } from "../types"
import { useLanguage } from "../i18n"

interface AccountSettingsProps {
  user: AuthUser
  theme: Theme
  onThemeChange: (t: Theme) => void
  onUpdate: (
    profile: Pick<AuthUser, "name" | "phone" | "position" | "department">,
  ) => Promise<void>
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const { t } = useLanguage()
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="px-6 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h2
          className="font-display font-semibold text-sm tracking-wide"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t(title)}
        </h2>
      </div>
      <div className="px-6 py-4 flex flex-col gap-4">{children}</div>
    </div>
  )
}

const Toggle = ({
  label,
  sub,
  defaultOn = false,
}: {
  label: string
  sub?: string
  defaultOn?: boolean
}) => {
  const { t } = useLanguage()
  const [on, setOn] = useState(defaultOn)

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div
          className="text-sm font-semibold font-body"
          style={{ color: "var(--foreground)" }}
        >
          {t(label)}
        </div>
        {sub && (
          <div
            className="text-xs font-body"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t(sub)}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOn(!on)}
        className="relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer"
        style={{ background: on ? "var(--primary)" : "var(--border)" }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: on ? "22px" : "2px" }}
        />
      </button>
    </div>
  )
}

export default function AccountSettings({
  user,
  theme,
  onThemeChange,
  onUpdate,
}: AccountSettingsProps) {
  const { t } = useLanguage()
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    position: user.position || "",
  })

  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  
  // State Modal Hapus Akun
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const saveProfile = async () => {
    setSavingProfile(true)
    setProfileError("")

    try {
      await onUpdate({
        name: profile.name,
        phone: profile.phone,
        position: profile.position,
        department: user.department,
      })

      setProfileSaved(true)
      window.setTimeout(() => setProfileSaved(false), 2500)
    } catch (error) {
      console.error("Account profile update failed:", error)
      setProfileError(
        error instanceof Error ? error.message : t("Profil gagal disimpan."),
      )
    } finally {
      setSavingProfile(false)
    }
  }

  const handleDeleteAccount = () => {
    alert(t("Akun Anda berhasil dihapus dari sistem."))
    setShowDeleteModal(false)
  }

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <Section title="PROFIL">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ background: "var(--primary)" }}
          >
            {user.name[0]}
          </div>
          <div>
            <div
              className="font-display font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {user.name}
            </div>
            <div
              className="text-sm font-body"
              style={{ color: "var(--muted-foreground)" }}
            >
              {user.email}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Nama Lengkap", key: "name" as const },
            { label: "Email", key: "email" as const },
            { label: "Nomor Telepon", key: "phone" as const },
            { label: "Jabatan", key: "position" as const },
          ].map((f) => (
            <div key={f.label}>
              <label
                className="block text-xs font-semibold mb-1.5 font-body"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t(f.label)}
              </label>
              <input
                value={profile[f.key]}
                readOnly={f.key === "email"}
                onChange={(event) =>
                  setProfile({ ...profile, [f.key]: event.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none read-only:opacity-70"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          ))}
        </div>
        {profileSaved && (
          <p
            role="status"
            className="text-xs font-body"
            style={{ color: "var(--success)" }}
          >
            {t("Profil berhasil disimpan.")}
          </p>
        )}
        {profileError && (
          <p
            role="alert"
            className="text-xs font-body"
            style={{ color: "var(--danger)" }}
          >
            {t(profileError)}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold font-body disabled:opacity-60 cursor-pointer"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {savingProfile ? t("Menyimpan...") : t("Simpan Profil")}
          </button>
        </div>
      </Section>

      <Section title="KEAMANAN">
        <h3
          className="font-semibold text-sm font-body -mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {t("Ubah Kata Sandi")}
        </h3>
        <p
          className="text-xs font-body"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t("Hubungi Administrator untuk mengatur ulang kata sandi melalui manajemen akun.")}
        </p>
        <div className="h-px" style={{ background: "var(--border)" }} />
        <Toggle
          label="Autentikasi Dua Faktor"
          sub="Tambahkan lapisan keamanan ekstra pada akun Anda"
        />
        <div>
          <div
            className="text-sm font-semibold font-body mb-2"
            style={{ color: "var(--foreground)" }}
          >
            {t("Sesi Aktif")}
          </div>
          <div
            className="rounded-xl p-3 flex items-center justify-between"
            style={{ background: "var(--muted)" }}
          >
            <div>
              <div
                className="text-xs font-semibold font-body"
                style={{ color: "var(--foreground)" }}
              >
                Chrome · Windows
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("Sesi saat ini · Jakarta, ID")}
              </div>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: "rgba(106,168,79,0.12)",
                color: "var(--success)",
              }}
            >
              {t("Aktif")}
            </span>
          </div>
        </div>
      </Section>

      <Section title="NOTIFIKASI">
        <Toggle
          label="Notifikasi Email"
          sub="Terima ringkasan aktivitas melalui email"
          defaultOn
        />
        <Toggle
          label="Peringatan Stok Menipis"
          sub="Dapatkan peringatan saat stok produk di bawah batas minimum"
          defaultOn
        />
        <Toggle
          label="Peringatan Pemindai Offline"
          sub="Beri tahu saat pemindai terputus"
          defaultOn
        />
        <Toggle
          label="Notifikasi Transaksi"
          sub="Beri tahu setiap ada pergerakan stok"
        />
      </Section>

      <Section title="TAMPILAN">
        <div>
          <div
            className="text-xs font-semibold mb-2 font-body"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t("Tema")}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["light", "dark"] as const).map((themeOption) => (
              <button
                key={themeOption}
                type="button"
                onClick={() => onThemeChange(themeOption)}
                className="py-3 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold font-body transition-all cursor-pointer"
                style={
                  theme === themeOption
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        border: "2px solid var(--primary)",
                      }
                    : {
                        background: "var(--muted)",
                        color: "var(--foreground)",
                        border: "2px solid var(--border)",
                      }
                }
              >
                <span className="text-lg">
                  {themeOption === "light" ? "☀" : "🌙"}
                </span>
                <span className="capitalize">{t(themeOption === "light" ? "Terang" : "Gelap")}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Zona Berbahaya yang Diperbarui */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(217,83,79,0.3)" }}
      >
        <div
          className="px-6 py-4"
          style={{
            borderBottom: "1px solid rgba(217,83,79,0.3)",
            background: "rgba(217,83,79,0.05)",
          }}
        >
          <h2
            className="font-display font-semibold text-sm"
            style={{ color: "var(--danger)" }}
          >
            {t("ZONA BERBAHAYA")}
          </h2>
        </div>
        <div
          className="px-6 py-4 flex items-center justify-between gap-4"
          style={{ background: "var(--card)" }}
        >
          <div>
            <div
              className="font-semibold text-sm font-body"
              style={{ color: "var(--foreground)" }}
            >
              {t("Hapus Akun")}
            </div>
            <div
              className="text-xs font-body"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t("Hapus akun Anda beserta seluruh data permanen dari sistem ini.")}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold font-body transition-colors cursor-pointer shrink-0"
            style={{
              background: "rgba(217,83,79,0.15)",
              color: "var(--danger)",
              border: "1px solid rgba(217,83,79,0.3)",
            }}
          >
            {t("Hapus Akun")}
          </button>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS AKUN */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-2xl w-full max-w-md overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2
                className="font-display font-semibold text-base"
                style={{ color: "var(--danger)" }}
              >
                ⚠️ {t("Hapus Akun")}
              </h2>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-lg cursor-pointer"
                style={{ color: "var(--muted-foreground)" }}
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 flex flex-col gap-3">
              <p
                className="text-sm font-body"
                style={{ color: "var(--foreground)" }}
              >
                {t("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")}
              </p>
            </div>
            <div
              className="flex gap-3 px-6 py-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body cursor-pointer"
                style={{
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {t("Batal")}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body cursor-pointer"
                style={{ background: "var(--danger)", color: "#fff" }}
              >
                {t("Konfirmasi Hapus")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}