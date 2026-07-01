import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Auth

// Only connect to emulator in development and if not already connected
if (process.env.NODE_ENV === "development") {
  try {
    // This will only work if you're using the Firebase emulator
    // Remove these lines if you're using the production Firebase
    // connectFirestoreEmulator(db, 'localhost', 8080)
  } catch (error) {
    // Emulator already connected or not available
  }
}

export { db }
export default app
