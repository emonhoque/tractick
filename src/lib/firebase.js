import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { API_KEYS } from '../constants'

const firebaseConfig = {
  apiKey: API_KEYS.FIREBASE_API_KEY,
  authDomain: API_KEYS.FIREBASE_AUTH_DOMAIN,
  projectId: API_KEYS.FIREBASE_PROJECT_ID,
  storageBucket: API_KEYS.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: API_KEYS.FIREBASE_MESSAGING_SENDER_ID,
  appId: API_KEYS.FIREBASE_APP_ID,
  measurementId: API_KEYS.FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app 