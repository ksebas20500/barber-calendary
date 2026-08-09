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
    await signInWithPopup(auth, googleProvider)
    // onAuthStateChanged handles the rest
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
