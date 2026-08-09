// Firebase configuration for Barbería Denver
// Project: barberia-denver

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'

const getValidApiKey = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY
  if (key && key !== 'your_api_key' && key.startsWith('AIza')) {
    return key
  }
  return 'AIzaSyC04YkDDLw5ahVZLRjnpAMLGltLE7CPa3I'
}

const firebaseConfig = {
  apiKey: getValidApiKey(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'barberia-denver.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'barberia-denver',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'barberia-denver.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '77622747470',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:77622747470:web:30363acc8219ca6c27be1f',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export { signInWithPopup, signInWithRedirect, signOut }
export default app
