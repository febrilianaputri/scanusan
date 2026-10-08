import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Konfigurasi
const firebaseConfig = {
  apiKey: "AIzaSyBSJdjlZIxjQRKYJq448AoAV-uB4kcakgQ",
  authDomain: "scanus-kami.firebaseapp.com",
  databaseURL: "https://scanus-kami-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scanus-kami",
  storageBucket: "scanus-kami.firebasestorage.app",
  messagingSenderId: "412744854450",
  appId: "1:412744854450:web:3460373570357014e492ab",
  measurementId: "G-XBLY1X5H2T"
};

// 2. Inisialisasi Firebase & Ekspor Modul
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 3. Fungsi Helper Login (Ditaruh SETELAH 'auth' diinisialisasi)
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login berhasil:", userCredential.user);
    return userCredential;
  } catch (error: any) {
    throw new Error(error?.message ?? "Gagal login");
  }
};