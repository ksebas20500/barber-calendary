import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider, signInWithPopup, signOut } from '@/lib/firebase'
import { authApi } from '@/lib/api'

interface AuthUser {
  firebaseUser: User
  dbUser: {
    id: string
    nombre: string
    email: string
    rol: 'CLIENTE' | 'BARBERO' | 'ADMIN'
    barbero?: { id: string }
  } | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isBarbero: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync user to our DB
          await authApi.sync({
            firebaseUid: firebaseUser.uid,
            nombre: firebaseUser.displayName || firebaseUser.email || 'Usuario',
            email: firebaseUser.email!,
          })

          // Get full user data with role
          const response = await authApi.me()
          setUser({ firebaseUser, dbUser: response.data.usuario })
        } catch (error) {
          console.error('Error syncing user:', error)
          setUser({ firebaseUser, dbUser: null })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
    if (!apiKey || apiKey === 'your_api_key') {
      const msg =
        '⚠️ No se ha configurado VITE_FIREBASE_API_KEY en el archivo frontend/.env.\n\nPor favor obtén tu Web API Key desde Firebase Console:\nProject Settings -> General -> Web Apps -> apiKey y colócala en frontend/.env'
      console.error(msg)
      alert(msg)
      return
    }

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error)
      if (error.code === 'auth/popup-blocked') {
        alert('⚠️ El navegador bloqueó la ventana emergente de Google. Permite ventanas emergentes (popups) en tu navegador para continuar.')
      } else if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid') {
        alert('⚠️ La API Key de Firebase configurada en frontend/.env no es válida. Revisa la clave en la consola de Firebase.')
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('⚠️ Dominio no autorizado en Firebase Console. Agrega "localhost" en Firebase Console -> Authentication -> Settings -> Authorized domains.')
      } else if (error.code !== 'auth/popup-closed-by-user') {
        alert(`⚠️ Error al iniciar sesión (${error.code || 'desconocido'}): ${error.message}`)
      }
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const isAdmin = user?.dbUser?.rol === 'ADMIN'
  const isBarbero = user?.dbUser?.rol === 'BARBERO' || isAdmin

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isAdmin, isBarbero }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
