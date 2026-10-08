import {
  cert,
  getApps,
  initializeApp,
  applicationDefault,
} from "firebase-admin/app"

import { getAuth } from "firebase-admin/auth"

function initializeFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0]!

  const projectId = process.env.FIREBASE_PROJECT_ID

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (serviceAccountJson) {
    const serviceAccount: unknown = JSON.parse(serviceAccountJson)

    if (typeof serviceAccount !== "object" || serviceAccount === null) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_JSON must contain a service account object",
      )
    }

    return initializeApp({
      credential: cert(serviceAccount as Parameters<typeof cert>[0]),
      projectId,
    })
  }

  return initializeApp({ credential: applicationDefault(), projectId })
}

export function firebaseAdminAuth() {
  return getAuth(initializeFirebaseAdmin())
}
