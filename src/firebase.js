import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDuDlvuSa958ns7jke3j9wAbbgmnKpdYxA",
  authDomain: "final-2291b-9228a.firebaseapp.com",
  projectId: "final-2291b-9228a",
  storageBucket: "final-2291b-9228a.firebasestorage.app",
  messagingSenderId: "531303938838",
  appId: "1:531303938838:web:7ce0609bddd2bc5c846e37",
  measurementId: "G-DJD843ZTG7"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
