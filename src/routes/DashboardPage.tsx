import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type RoleKey = 'Admin' | 'Doctor' | 'Patient'

const stats = [
  { label: 'Patients today', value: '128' },
  { label: 'Appointments', value: '42' },
  { label: 'Available doctors', value: '18' },
  { label: 'Pending bills', value: '9' },
]

export function DashboardPage() {
  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <span className="badge">Live overview</span>
          <h1>Dashboard</h1>
          <p>Track hospital activity, appointments, and billing from one place.</p>
        </div>
      </header>

      <div className="kpiGrid">
        {stats.map((stat) => (
          <article className="card" key={stat.label}>
            <span className="metricLabel">{stat.label}</span>
            <strong className="metricValue">{stat.value}</strong>
          </article>
        ))}
      </div>

      <section className="card">
        <h2>Today&apos;s queue</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aarav Mehta</td>
              <td>Cardiology</td>
              <td>Checked in</td>
            </tr>
            <tr>
              <td>Neha Sharma</td>
              <td>Orthopedics</td>
              <td>Waiting</td>
            </tr>
            <tr>
              <td>Rohan Gupta</td>
              <td>Neurology</td>
              <td>In consultation</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  )
}


