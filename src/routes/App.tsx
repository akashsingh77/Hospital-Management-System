import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Layout } from '../ui/Layout/Layout'
import { HomePage } from './HomePage'
import { DashboardPage } from './DashboardPage'
import { PatientsPage } from './PatientsPage'
import { AppointmentsPage } from './AppointmentsPage'
import { DoctorsPage } from './DoctorsPage'
import { BillingPage } from './BillingPage'
import { PatientModulePage } from './PatientModulePage'
import { ProfileManagementPage } from './ProfileManagementPage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'

function ProtectedLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Layout />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Role landing pages (Admin/Doctor/Patient) */}
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />

        {/* Keep existing */}
        <Route path="/patient-module" element={<PatientModulePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/profile" element={<ProfileManagementPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}


