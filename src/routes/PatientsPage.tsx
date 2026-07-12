import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

type PatientApiResponse = {
  id: number
  name: string
  age: number
  condition?: string
  status?: string
}

export function PatientsPage() {
  const { token } = useAuth()
  const [patients, setPatients] = useState<PatientApiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('http://localhost:8081/api/patients', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(text || `Request failed (${res.status})`)
        }

        const data = (await res.json()) as PatientApiResponse[]
        if (!cancelled) setPatients(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load patients')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <h1>Patients</h1>
          <p>Manage registrations, admissions, and clinical status.</p>
        </div>
        <button className="btn btnPrimary" type="button">Add patient</button>
      </header>

      <section className="card">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'crimson' }}>{error}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Condition</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.condition ?? '-'}</td>
                  <td>{patient.status ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  )
}

