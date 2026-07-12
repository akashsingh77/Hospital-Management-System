import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/patient-module', label: 'Patient Module' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/billing', label: 'Billing' },
  { to: '/profile', label: 'Profile' },
]

export function Layout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">+</span>
          <div>
            <strong>CareDesk</strong>
            <span>Hospital Management</span>
          </div>
        </div>

        <nav className="navList" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navLink${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="userPanel">
            <span className="label">{user.role}</span>
            <strong>{user.name}</strong>
            <button className="btn" type="button" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </aside>

      <main className="mainPanel">
        <Outlet />
      </main>
    </div>
  )
}
