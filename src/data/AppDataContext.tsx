import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { doc, onSnapshot, setDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../auth/AuthContext"
import type { Product, Supplier, Transaction, User } from "../types"

interface AppData {
  products: Product[]
  transactions: Transaction[]
  suppliers: Supplier[]
  users: User[]
}

interface AppDataContextValue {
  data: AppData
  setData: Dispatch<SetStateAction<AppData>>
  refreshUsers: () => Promise<void>
  replaceUsers: (users: User[]) => void
  loading: boolean
  error: string | null
}

const emptyData: AppData = {
  products: [],
  transactions: [],
  suppliers: [],
  users: [],
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setDataState] = useState<AppData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const latestData = useRef(data)

  // 1. Dengarkan perubahan data produk/transaksi/supplier secara real-time dari Firestore
  useEffect(() => {
    setLoading(true)

    // Mengambil dokumen utama aplikasi dari koleksi 'appData' di Firestore
    const docRef = doc(db, "appData", "main")
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const appDataFromDb = docSnap.data() as Omit<AppData, "users">
          const nextData = {
            products: appDataFromDb.products || [],
            transactions: appDataFromDb.transactions || [],
            suppliers: appDataFromDb.suppliers || [],
            users: latestData.current.users,
          }
          latestData.current = nextData
          setDataState(nextData)
        } else {
          // Jika dokumen belum ada, inisialisasi dokumen kosong
          setDoc(docRef, { products: [], transactions: [], suppliers: [] })
        }
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error("Firestore listen error:", err)
        setError("Gagal terhubung ke database Firebase.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // 2. Ambil data users dari koleksi 'users' jika pengguna adalah admin
  const refreshUsers = useCallback(async () => {
    if (user?.role !== "admin") return

    try {
      const usersCol = collection(db, "users")
      const userSnapshot = await getDocs(usersCol)
      const userList = userSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as User
      )

      const nextData = { ...latestData.current, users: userList }
      latestData.current = nextData
      setDataState(nextData)
    } catch (err) {
      console.error("Error fetching users from Firestore:", err)
    }
  }, [user?.role])

  useEffect(() => {
    if (user?.role === "admin") {
      refreshUsers()
    }
  }, [user?.role, refreshUsers])

  // 3. Simpan perubahan data ke Firestore ketika `setData` dipanggil
  const setData: Dispatch<SetStateAction<AppData>> = useCallback(
    async (action) => {
      const nextData =
        typeof action === "function" ? action(latestData.current) : action

      latestData.current = nextData
      setDataState(nextData)

      const { users: _users, ...persisted } = nextData

      try {
        const docRef = doc(db, "appData", "main")
        await setDoc(docRef, persisted, { merge: true })
        setError(null)
      } catch (saveError) {
        console.error("Unable to save data to Firebase:", saveError)
        setError("Perubahan gagal disimpan ke database cloud.")
      }
    },
    []
  )

  const replaceUsers = useCallback((users: User[]) => {
    const nextData = { ...latestData.current, users }
    latestData.current = nextData
    setDataState(nextData)
  }, [])

  return (
    <AppDataContext.Provider
      value={{ data, setData, refreshUsers, replaceUsers, loading, error }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context)
    throw new Error("useAppData must be used inside AppDataProvider")
  return context
}