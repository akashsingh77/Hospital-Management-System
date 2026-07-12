import { FormEvent, useState } from 'react'

type Appointment = {
  id: string
  date: string
  time: string
  patient: string
  department: string
  doctor: string
  room: string
  status: string
}

const doctors = [
  { name: 'Dr. Kavya Iyer', department: 'Cardiology', room: 'C-104' },
  { name: 'Dr. Ritu Shah', department: 'Cardiology', room: 'C-108' },
  { name: 'Dr. Meera Nair', department: 'Orthopedics', room: 'O-212' },
  { name: 'Dr. Vikram Bose', department: 'Orthopedics', room: 'O-218' },
  { name: 'Dr. Arjun Rao', department: 'Neurology', room: 'N-305' },
  { name: 'Dr. Sanjay Menon', department: 'General Medicine', room: 'G-012' },
]

const departments = Array.from(new Set(doctors.map((doctor) => doctor.department)))

const initialAppointments: Appointment[] = [
  {
    id: 'APT-2401',
    date: '2026-07-08',
    time: '09:30',
    patient: 'Aarav Mehta',
    department: 'Cardiology',
    doctor: 'Dr. Kavya Iyer',
    room: 'C-104',
    status: 'Confirmed',
  },
  {
    id: 'APT-2402',
    date: '2026-07-08',
    time: '10:15',
    patient: 'Neha Sharma',
    department: 'Orthopedics',
    doctor: 'Dr. Meera Nair',
    room: 'O-212',
    status: 'Confirmed',
  },
  {
    id: 'APT-2403',
    date: '2026-07-08',
    time: '11:00',
    patient: 'Rohan Gupta',
    department: 'Neurology',
    doctor: 'Dr. Arjun Rao',
    room: 'N-305',
    status: 'Checked in',
  },
]

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [booking, setBooking] = useState({
    patient: 'Aarav Mehta',
    department: departments[0],
    doctor: doctors[0].name,
    date: '2026-07-09',
    time: '10:00',
  })
  const [confirmation, setConfirmation] = useState('')

  const availableDoctors = doctors.filter((doctor) => doctor.department === booking.department)
  const selectedDoctor = availableDoctors.find((doctor) => doctor.name === booking.doctor) ?? availableDoctors[0]

  function handleDepartmentChange(department: string) {
    const firstDoctor = doctors.find((doctor) => doctor.department === department)

    setBooking((current) => ({
      ...current,
      department,
      doctor: firstDoctor?.name ?? current.doctor,
    }))
    setConfirmation('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextAppointment = {
      id: `APT-${Math.floor(2500 + Math.random() * 500)}`,
      date: booking.date,
      time: booking.time,
      patient: booking.patient,
      department: booking.department,
      doctor: selectedDoctor.name,
      room: selectedDoctor.room,
      status: 'Confirmed',
    }

    setAppointments((current) => [nextAppointment, ...current])
    setConfirmation(`${nextAppointment.id} confirmed for ${nextAppointment.patient}.`)
  }

  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <h1>Appointment Booking</h1>
          <p>Select a department, choose a doctor, pick a date and time, then confirm.</p>
        </div>
      </header>

      <section className="splitGrid">
        <form className="card formStack" onSubmit={handleSubmit}>
          <h2>Book appointment</h2>
          <label className="field">
            <span className="label">Patient</span>
            <input
              className="input"
              value={booking.patient}
              onChange={(event) => {
                setBooking((current) => ({ ...current, patient: event.target.value }))
                setConfirmation('')
              }}
            />
          </label>
          <label className="field">
            <span className="label">Department</span>
            <select className="input" value={booking.department} onChange={(event) => handleDepartmentChange(event.target.value)}>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="label">Doctor</span>
            <select
              className="input"
              value={booking.doctor}
              onChange={(event) => {
                setBooking((current) => ({ ...current, doctor: event.target.value }))
                setConfirmation('')
              }}
            >
              {availableDoctors.map((doctor) => (
                <option key={doctor.name} value={doctor.name}>{doctor.name}</option>
              ))}
            </select>
          </label>
          <div className="formGrid compactGrid">
            <label className="field">
              <span className="label">Date</span>
              <input
                className="input"
                type="date"
                value={booking.date}
                onChange={(event) => {
                  setBooking((current) => ({ ...current, date: event.target.value }))
                  setConfirmation('')
                }}
              />
            </label>
            <label className="field">
              <span className="label">Time</span>
              <input
                className="input"
                type="time"
                value={booking.time}
                onChange={(event) => {
                  setBooking((current) => ({ ...current, time: event.target.value }))
                  setConfirmation('')
                }}
              />
            </label>
          </div>
          <button className="btn btnPrimary" type="submit">Confirm appointment</button>
        </form>

        <aside className="card summaryPanel">
          <span className="label">Appointment summary</span>
          <h2>{selectedDoctor.name}</h2>
          <p>{booking.department}</p>
          <div className="bookingSummary">
            <span>Patient</span>
            <strong>{booking.patient}</strong>
            <span>Date</span>
            <strong>{booking.date}</strong>
            <span>Time</span>
            <strong>{booking.time}</strong>
            <span>Room</span>
            <strong>{selectedDoctor.room}</strong>
          </div>
          {confirmation && <span className="successText">{confirmation}</span>}
        </aside>
      </section>

      <section className="card">
        <div className="sectionHeader">
          <div>
            <h2>Scheduled appointments</h2>
            <p>Confirmed appointments appear here immediately.</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.patient}</td>
                <td>{appointment.department}</td>
                <td>{appointment.doctor}</td>
                <td>{appointment.room}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  )
}
