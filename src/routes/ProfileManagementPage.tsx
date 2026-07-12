import { FormEvent, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

type PersonalInfo = {
  name: string
  email: string
  phone: string
  address: string
  emergencyContact: string
}

const profileStorageKey = 'careDeskProfile'

function readStoredProfile(user: { name: string; email: string } | null | undefined): PersonalInfo {
  const fallback = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '+91 98765 43210',
    address: '14 MG Road, Bengaluru',
    emergencyContact: 'Priya Mehta, +91 98765 11111',
  }
  const stored = window.localStorage.getItem(profileStorageKey)

  if (!stored) {
    return fallback
  }

  try {
    return { ...fallback, ...JSON.parse(stored) }
  } catch {
    window.localStorage.removeItem(profileStorageKey)
    return fallback
  }
}

export function ProfileManagementPage() {
  const { changePassword, updateUser, user } = useAuth()
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => readStoredProfile(user))
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    nextPassword: '',
    confirmPassword: '',
  })
  const [profileNotice, setProfileNotice] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')

  function updatePersonalInfo(field: keyof PersonalInfo, value: string) {
    setPersonalInfo((current) => ({ ...current, [field]: value }))
    setProfileNotice('')
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateUser({
      name: personalInfo.name,
      email: personalInfo.email,
    })
    window.localStorage.setItem(profileStorageKey, JSON.stringify(personalInfo))
    setProfileNotice('Personal information updated.')
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError('')
    setPasswordNotice('')

    if (passwords.nextPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }

    if (passwords.nextPassword !== passwords.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    const changed = changePassword(passwords.currentPassword, passwords.nextPassword)

    if (!changed) {
      setPasswordError('Current password is incorrect.')
      return
    }

    setPasswords({
      currentPassword: '',
      nextPassword: '',
      confirmPassword: '',
    })
    setPasswordNotice('Password changed successfully.')
  }

  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <span className="badge">Account settings</span>
          <h1>Profile Management</h1>
          <p>Update personal information and change your password.</p>
        </div>
      </header>

      <section className="splitGrid">
        <form className="card formStack" onSubmit={handleProfileSubmit}>
          <div className="sectionHeader">
            <div>
              <h2>Personal information</h2>
              <p>These details appear across your CareDesk account.</p>
            </div>
            {profileNotice && <span className="successText">{profileNotice}</span>}
          </div>

          <label className="field">
            <span className="label">Full name</span>
            <input
              className="input"
              value={personalInfo.name}
              onChange={(event) => updatePersonalInfo('name', event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="label">Email</span>
            <input
              className="input"
              type="email"
              value={personalInfo.email}
              onChange={(event) => updatePersonalInfo('email', event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="label">Phone</span>
            <input
              className="input"
              value={personalInfo.phone}
              onChange={(event) => updatePersonalInfo('phone', event.target.value)}
            />
          </label>
          <label className="field">
            <span className="label">Emergency contact</span>
            <input
              className="input"
              value={personalInfo.emergencyContact}
              onChange={(event) => updatePersonalInfo('emergencyContact', event.target.value)}
            />
          </label>
          <label className="field">
            <span className="label">Address</span>
            <textarea
              className="input"
              rows={4}
              value={personalInfo.address}
              onChange={(event) => updatePersonalInfo('address', event.target.value)}
            />
          </label>
          <button className="btn btnPrimary" type="submit">Update information</button>
        </form>

        <form className="card formStack" onSubmit={handlePasswordSubmit}>
          <div className="sectionHeader">
            <div>
              <h2>Change password</h2>
              <p>Use your current password before setting a new one.</p>
            </div>
          </div>

          <label className="field">
            <span className="label">Current password</span>
            <input
              className="input"
              type="password"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span className="label">New password</span>
            <input
              className="input"
              type="password"
              value={passwords.nextPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, nextPassword: event.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span className="label">Confirm password</span>
            <input
              className="input"
              type="password"
              value={passwords.confirmPassword}
              onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
              required
            />
          </label>
          {passwordError && <span className="formError">{passwordError}</span>}
          {passwordNotice && <span className="successText">{passwordNotice}</span>}
          <button className="btn btnPrimary" type="submit">Change password</button>
        </form>
      </section>
    </section>
  )
}
