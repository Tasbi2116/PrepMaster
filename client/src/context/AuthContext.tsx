import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import api from '../lib/axios'
import type { Profile } from '../types'

// ─── Constants ────────────────────────────────────────────────────────────────
// Single source of truth for localStorage keys
const TOKEN_KEY         = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user:     Profile | null
  loading:  boolean
  isAdmin:  boolean
  login:    (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string, full_name: string) => Promise<void>
  logout:   () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null)

// ─── Helper — persist tokens consistently ────────────────────────────────────
// AIHintPanel reads 'token' key, so we keep both keys in sync
const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  // Keep 'token' key in sync for AIHintPanel and any future consumers
  localStorage.setItem('token', accessToken)
}

const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem('token')
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount — restore session from localStorage if token exists
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setLoading(false)
      return
    }

    // Also ensure 'token' key is in sync in case user had an old session
    localStorage.setItem('token', token)

    api.get<{ success: boolean; data: Profile }>('/auth/me')
      .then(res => setUser(res.data.data ?? null))
      .catch(() => {
        // Token is invalid or expired — clear everything
        clearTokens()
      })
      .finally(() => setLoading(false))
  }, [])

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post<{
      success: boolean
      data: {
        access_token:  string
        refresh_token: string
        profile:       Profile
      }
    }>('/auth/login', { email, password })

    const { access_token, refresh_token, profile } = res.data.data

    // Persist tokens — saveTokens keeps all keys in sync
    saveTokens(access_token, refresh_token)
    setUser(profile)
  }

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = async (
    email:     string,
    password:  string,
    username:  string,
    full_name: string
  ): Promise<void> => {
    await api.post('/auth/register', { email, password, username, full_name })
    // Registration does not auto-login — user must login separately
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = (): void => {
    clearTokens()
    setUser(null)
    window.location.href = '/login'
  }

  // ─── Context value ───────────────────────────────────────────────────────────
  const value: AuthContextType = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}