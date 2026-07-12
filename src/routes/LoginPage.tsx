import { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth, UserRole } from '../auth/AuthContext'


const roles: UserRole[] = ['Patient', 'Doctor', 'Admin']

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [role, setRole] = useState<UserRole>('Patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await login({ email, password, role })

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="loginPage">
      <section className="loginPanel card">
        <span className="badge">Hospital Management System</span>
        <h1>Login</h1>
        <p>Patients, Doctors, and Admin log in using their credentials.</p>

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
            <span className="label">Email</span>
            <input
              className="input"
              type="email"
              placeholder={role === 'Patient' ? 'patient@hospital.com' : role === 'Doctor' ? 'doctor@hospital.com' : 'admin@hospital.com'}
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
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="formError" role="alert">{error}</p>}

          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Continue'}
          </button>

          <p className="smallText">
            New here?{' '}
            <Link to="/register">Create account</Link>
          </p>

        </form>
      </section>
    </main>
  )
}



