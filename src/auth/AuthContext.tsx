import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import type { AuthUser } from "../types"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"
import { migrateLegacyInventory } from "../lib/legacy-inventory"

interface AuthContextValue {
  user: AuthUser | null
  checkingSession: boolean
  connectionError: string | null
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (
    profile: Pick<AuthUser, "name" | "phone" | "position" | "department">,
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // 1. Pantau status autentikasi Firebase secara real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Ambil detail profil/role pengguna dari Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)

          let userData: AuthUser

          if (userDoc.exists()) {
            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || userDoc.data().name || "User",
              role: userDoc.data().role || "staff",
              phone: userDoc.data().phone || "",
              position: userDoc.data().position || "",
              department: userDoc.data().department || "",
            }
          } else {
            // Jika dokumen user di Firestore belum ada, buat dokumen default
            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User",
              role: "admin", // default role untuk user pertama
              phone: "",
              position: "",
              department: "",
            }
            await setDoc(userDocRef, userData)
          }

          if (userData.role === "admin") {
            try {
              await migrateLegacyInventory()
            } catch (error) {
              console.error(
                "Legacy inventory migration could not be completed:",
                error,
              )
            }
          }

          setUser(userData)
          setConnectionError(null)
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error)
          setConnectionError("Gagal mengambil data profil dari Firebase Firestore.")
        }
      } else {
        setUser(null)
      }
      setCheckingSession(false)
    })

    return () => unsubscribe()
  }, [])

  // 2. Login menggunakan Firebase Auth
  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      setConnectionError(null)
      // Atur apakah login diingat permanen (Local) atau hanya per sesi browser (Session)
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      )

      await signInWithEmailAndPassword(auth, email, password)
    },
    [],
  )

  // 3. Logout menggunakan Firebase Auth
  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setConnectionError(null)
  }, [])

  // 4. Update Profile menggunakan Firebase & Firestore
  const updateProfile = useCallback(
    async (
      profile: Pick<AuthUser, "name" | "phone" | "position" | "department">,
    ) => {
      if (!auth.currentUser) return

      // Update display name di Firebase Auth
      if (profile.name) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: profile.name,
        })
      }

      // Update detail profil tambahan di Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userDocRef, profile)

      setUser((prev) => (prev ? { ...prev, ...profile } : null))
    },
    [],
  )

  const value = useMemo(
    () => ({
      user,
      checkingSession,
      connectionError,
      login,
      logout,
      updateProfile,
    }),
    [user, checkingSession, connectionError, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}