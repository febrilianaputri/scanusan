import { initializeApp, getApps } from "firebase/app"

import {
  initializeAuth,
  inMemoryPersistence,
  signInWithCustomToken,
  signOut,
} from "firebase/auth"

import type { Auth } from "firebase/auth"

import { apiRequest } from "./api"

let authInstance: Auth | undefined

function getFirebaseAuth() {
  if (authInstance) return authInstance

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  if (Object.values(config).some((value) => !value)) {
    throw new Error(
      "Firebase client configuration is incomplete. Check the VITE_FIREBASE_* environment variables.",
    )
  }

  const app = getApps()[0] ?? initializeApp(config)

  authInstance = initializeAuth(app, { persistence: inMemoryPersistence })

  return authInstance
}

export async function signInForSession(email: string, password: string) {
  const auth = getFirebaseAuth()

  const { customToken } = await apiRequest<{ customToken: string }>(
    "/api/auth/login",
    {
      method: "POST",

      body: JSON.stringify({ email, password }),
    },
  )

  const credential = await signInWithCustomToken(auth, customToken)

  return {
    auth,

    idToken: await credential.user.getIdToken(),
  }
}

export async function clearFirebaseClientSession(auth?: Auth) {
  if (auth?.currentUser) await signOut(auth)
}
