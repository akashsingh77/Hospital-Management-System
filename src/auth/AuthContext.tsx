import { createContext, useContext, useMemo, useState } from 'react'

export type UserRole = 'Patient' | 'Doctor' | 'Admin'

type BackendErrorPayload = {
  error?: string
  message?: string
  details?: string
}

function extractBackendErrorMessage(bodyText: string): string {
  // Backend can return JSON or plain text.
  if (!bodyText) return ''

  try {
    const data = JSON.parse(bodyText) as BackendErrorPayload
    return data?.error ?? data?.message ?? data?.details ?? ''
  } catch {
    // Not JSON => treat as plain text.
    return bodyText
  }
}

type AuthUser = {
  name: string
  email: string
  role: UserRole
}

type LoginCredentials = {
  email: string
  password: string
  role: UserRole
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  login: (
    credentials: LoginCredentials
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => void
  updateUser: (updates: Pick<AuthUser, 'name' | 'email'>) => void
  changePassword: (currentPassword: string, nextPassword: string) => Promise<boolean>
}

const storageKeyUser = 'careDeskUser'
const storageKeyToken = 'careDeskToken'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function safeParseJSON<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function readStoredUser(): AuthUser | null {
  const stored = window.localStorage.getItem(storageKeyUser)
  if (!stored) return null
  return safeParseJSON<AuthUser>(stored)
}

function readStoredToken(): string | null {
  return window.localStorage.getItem(storageKeyToken)
}

function mapRoleToBackend(role: UserRole) {
  // Backend enum values are exactly: ADMIN, DOCTOR, PATIENT
  return role === 'Admin' ? 'ADMIN' : role === 'Doctor' ? 'DOCTOR' : 'PATIENT'
}

function decodeJwtRole(token: string): UserRole | null {
  // (kept as-is; not used by login flow)
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payloadB64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

    const payloadStr = window.atob(payloadB64)
    const payload = JSON.parse(payloadStr) as { role?: string }

    const r = (payload.role ?? '').toUpperCase()
    if (r === 'ADMIN') return 'Admin'
    if (r === 'DOCTOR') return 'Doctor'
    if (r === 'PATIENT') return 'Patient'
    return null
  } catch {
    return null
  }
}

type AuthResponse = {
  token: string
  userId: number
  role: string
  fullName: string
  email: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [token, setToken] = useState<string | null>(() => readStoredToken())

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      token,
      login: async (credentials) => {
        const roleForBackend = mapRoleToBackend(credentials.role)

        try {
          const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              role: roleForBackend,
            }),
          })

          // IMPORTANT: always read response body on errors so we can show the real reason.
          if (!response.ok) {
            const bodyText = await response.text().catch(() => '')
            const backendMsg = extractBackendErrorMessage(bodyText)

            return {
              ok: false as const,
              error:
                backendMsg ||
                (bodyText ? bodyText : `Login failed (HTTP ${response.status})`),
            }
          }

          // Success path
          const data = (await response.json()) as AuthResponse

          const nextUser: AuthUser = {
            name: data.fullName,
            email: data.email,
            role:
              data.role?.toUpperCase() === 'ADMIN'
                ? 'Admin'
                : data.role?.toUpperCase() === 'DOCTOR'
                  ? 'Doctor'
                  : 'Patient',
          }

          setUser(nextUser)
          setToken(data.token)
          window.localStorage.setItem(storageKeyUser, JSON.stringify(nextUser))
          window.localStorage.setItem(storageKeyToken, data.token)

          return { ok: true as const }
        } catch (err: any) {
          // Network/CORS/JSON parsing errors end up here.
          return { ok: false as const, error: err?.message ? String(err.message) : 'Login failed. Please check your credentials.' }
        }
      },
      logout() {
        setUser(null)
        setToken(null)
        window.localStorage.removeItem(storageKeyUser)
        window.localStorage.removeItem(storageKeyToken)
      },
      updateUser(updates) {
        if (!user) return
        const nextUser = { ...user, ...updates }
        setUser(nextUser)
        window.localStorage.setItem(storageKeyUser, JSON.stringify(nextUser))
      },
      async changePassword() {
        // backend does not expose a change-password endpoint in this repo
        return false
      },
    }
  }, [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

