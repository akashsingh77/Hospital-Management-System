import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserRole, useAuth } from '../auth/AuthContext'

type RegisterPayload = {
  fullName: string
  email: string
  password: string
  role: UserRole
}

const roles: UserRole[] = ['Patient', 'Doctor', 'Admin']

export function RegisterPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [role, setRole] = useState<UserRole>('Patient')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: RegisterPayload = { fullName, email, password, role }

      const roleForBackend =
        payload.role === 'Admin' ? 'ADMIN' : payload.role === 'Doctor' ? 'DOCTOR' : 'PATIENT'

      const response = await fetch('http://localhost:8081/api/auth/register', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password,
          role: roleForBackend,
        }),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        let message = ''
        try {
          const data = JSON.parse(text)
          message = data?.error ?? data?.message ?? data?.details ?? ''
        } catch {
          message = text
        }
        setError(message || `Request failed (${response.status})`)
        setLoading(false)
        return
      }

      // backend auto-login after registration and returns JWT.
      // Since our AuthContext already knows how to login, do a login right away to persist the JWT.
      const loginResult = await login({ email: payload.email, password: payload.password, role: payload.role })
      if (!loginResult.ok) {
        setError(loginResult.error)
        setLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (err: any) {
      // Surface backend message if available; otherwise keep a sensible fallback.
      const fallback = 'Registration failed'
      const msg = err?.message ? String(err.message) : ''
      setError(msg || fallback)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="loginPage">
      <section className="loginPanel card">
        <span className="badge">Create account</span>
        <h1>Register</h1>

        <form className="formStack" onSubmit={handleSubmit}>
          <div className="rolePicker" aria-label="Select account role">
            {roles.map((roleOption) => (
              <button
                className={`roleOption${role === roleOption ? ' selected' : ''}`}
                key={roleOption}
                type="button"
                onClick={() => {
                  setRole(roleOption)
                  setError('')
                }}
              >
                {roleOption}
              </button>
            ))}
          </div>

          <label className="field">
            <span className="label">Full name</span>
            <input
              className="input"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <input
              className="input"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="formError" role="alert">{error}</p>}

          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  )
}


