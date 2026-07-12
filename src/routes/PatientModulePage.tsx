import { FormEvent, useState } from 'react'

type Profile = {
  name: string
  age: string
  phone: string
  email: string
  bloodGroup: string
  address: string
  emergencyContact: string
}

type Appointment = {
  id: string
  date: string
  time: string
  doctor: string
  department: string
  reason: string
  status: string
}

const doctors = [
  { name: 'Dr. Kavya Iyer', department: 'Cardiology' },
  { name: 'Dr. Ritu Shah', department: 'Cardiology' },
  { name: 'Dr. Meera Nair', department: 'Orthopedics' },
  { name: 'Dr. Vikram Bose', department: 'Orthopedics' },
  { name: 'Dr. Arjun Rao', department: 'Neurology' },
  { name: 'Dr. Sanjay Menon', department: 'General Medicine' },
]

const departments = Array.from(new Set(doctors.map((doctor) => doctor.department)))

const initialProfile: Profile = {
  name: 'Aarav Mehta',
  age: '42',
  phone: '+91 98765 43210',
  email: 'patient@hospital.com',
  bloodGroup: 'B+',
  address: '14 MG Road, Bengaluru',
  emergencyContact: 'Priya Mehta, +91 98765 11111',
}

const initialAppointments: Appointment[] = [
  {
    id: 'APT-2401',
    date: '2026-07-08',
    time: '09:30',
    doctor: 'Dr. Kavya Iyer',
    department: 'Cardiology',
    reason: 'Blood pressure review',
    status: 'Upcoming',
  },
  {
    id: 'APT-2320',
    date: '2026-06-12',
    time: '11:00',
    doctor: 'Dr. Sanjay Menon',
    department: 'General Medicine',
    reason: 'Routine checkup',
    status: 'Completed',
  },
  {
    id: 'APT-2288',
    date: '2026-05-18',
    time: '14:15',
    doctor: 'Dr. Kavya Iyer',
    department: 'Cardiology',
    reason: 'ECG follow-up',
    status: 'Completed',
  },
]

const documents = [
  { title: 'Prescription - Cardiology Review', doctor: 'Dr. Kavya Iyer', date: '2026-06-12', type: 'Prescription' },
  { title: 'Lipid Profile Report', doctor: 'Lab Services', date: '2026-06-10', type: 'Report' },
  { title: 'ECG Report', doctor: 'Diagnostics', date: '2026-05-18', type: 'Report' },
]

const invoices = [
  { id: 'INV-1042', description: 'Cardiology consultation and ECG', due: '2026-07-15', amount: 18400, status: 'Due' },
  { id: 'INV-1018', description: 'Routine checkup', due: '2026-06-12', amount: 2200, status: 'Paid' },
]

const tabs = ['Profile', 'Book Appointment', 'History', 'Documents', 'Payments'] as const
type Tab = (typeof tabs)[number]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PatientModulePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile')
  const [profile, setProfile] = useState(initialProfile)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [profileNotice, setProfileNotice] = useState('')
  const [bookingNotice, setBookingNotice] = useState('')
  const [paymentNotice, setPaymentNotice] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0].id)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [booking, setBooking] = useState({
    department: departments[0],
    doctor: doctors[0].name,
    date: '2026-07-09',
    time: '10:00',
    reason: '',
  })

  const availableDoctors = doctors.filter((doctor) => doctor.department === booking.department)
  const selectedDoctor = availableDoctors.find((doctor) => doctor.name === booking.doctor) ?? availableDoctors[0]
  const outstandingTotal = invoices
    .filter((invoice) => invoice.status !== 'Paid')
    .reduce((total, invoice) => total + invoice.amount, 0)

  function updateProfile(field: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }))
    setProfileNotice('')
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileNotice('Profile updated successfully.')
  }

  function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextAppointment = {
      id: `APT-${Math.floor(2500 + Math.random() * 500)}`,
      date: booking.date,
      time: booking.time,
      doctor: selectedDoctor.name,
      department: booking.department,
      reason: booking.reason || 'Consultation',
      status: 'Booked',
    }

    setAppointments((current) => [nextAppointment, ...current])
    setBookingNotice(`${nextAppointment.id} booked with ${nextAppointment.doctor}.`)
    setBooking((current) => ({ ...current, reason: '' }))
    setActiveTab('History')
  }

  function handlePaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const invoice = invoices.find((item) => item.id === selectedInvoice)
    setPaymentNotice(`${invoice?.id ?? 'Invoice'} payment initiated through ${paymentMethod}.`)
  }

  function handleDepartmentChange(department: string) {
    const firstDoctor = doctors.find((doctor) => doctor.department === department)

    setBooking((current) => ({
      ...current,
      department,
      doctor: firstDoctor?.name ?? current.doctor,
    }))
    setBookingNotice('')
  }

  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <span className="badge">Patient portal</span>
          <h1>Patient Module</h1>
          <p>Manage your profile, appointments, medical documents, and payments.</p>
        </div>
      </header>

      <div className="moduleTabs" role="tablist" aria-label="Patient module sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tabButton${activeTab === tab ? ' selected' : ''}`}
            type="button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <section className="card">
          <div className="sectionHeader">
            <div>
              <h2>Profile</h2>
              <p>Keep contact and emergency details current.</p>
            </div>
            {profileNotice && <span className="successText">{profileNotice}</span>}
          </div>

          <form className="formGrid" onSubmit={handleProfileSubmit}>
            <label className="field">
              <span className="label">Full name</span>
              <input className="input" value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} />
            </label>
            <label className="field">
              <span className="label">Age</span>
              <input className="input" value={profile.age} onChange={(event) => updateProfile('age', event.target.value)} />
            </label>
            <label className="field">
              <span className="label">Phone</span>
              <input className="input" value={profile.phone} onChange={(event) => updateProfile('phone', event.target.value)} />
            </label>
            <label className="field">
              <span className="label">Email</span>
              <input className="input" type="email" value={profile.email} onChange={(event) => updateProfile('email', event.target.value)} />
            </label>
            <label className="field">
              <span className="label">Blood group</span>
              <input className="input" value={profile.bloodGroup} onChange={(event) => updateProfile('bloodGroup', event.target.value)} />
            </label>
            <label className="field">
              <span className="label">Emergency contact</span>
              <input className="input" value={profile.emergencyContact} onChange={(event) => updateProfile('emergencyContact', event.target.value)} />
            </label>
            <label className="field spanTwo">
              <span className="label">Address</span>
              <textarea className="input" rows={3} value={profile.address} onChange={(event) => updateProfile('address', event.target.value)} />
            </label>
            <div className="formActions spanTwo">
              <button className="btn btnPrimary" type="submit">Save profile</button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'Book Appointment' && (
        <section className="splitGrid">
          <form className="card formStack" onSubmit={handleBookingSubmit}>
            <h2>Book an appointment</h2>
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
              <select className="input" value={booking.doctor} onChange={(event) => setBooking((current) => ({ ...current, doctor: event.target.value }))}>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.name} value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Date</span>
              <input className="input" type="date" value={booking.date} onChange={(event) => setBooking((current) => ({ ...current, date: event.target.value }))} />
            </label>
            <label className="field">
              <span className="label">Time</span>
              <input className="input" type="time" value={booking.time} onChange={(event) => setBooking((current) => ({ ...current, time: event.target.value }))} />
            </label>
            <label className="field">
              <span className="label">Reason</span>
              <textarea className="input" rows={4} value={booking.reason} onChange={(event) => setBooking((current) => ({ ...current, reason: event.target.value }))} />
            </label>
            <button className="btn btnPrimary" type="submit">Confirm booking</button>
          </form>

          <aside className="card summaryPanel">
            <span className="label">Selected care team</span>
            <h2>{selectedDoctor.name}</h2>
            <p>{booking.department}</p>
            <div className="bookingSummary">
              <span>Date</span>
              <strong>{booking.date}</strong>
              <span>Time</span>
              <strong>{booking.time}</strong>
            </div>
            {bookingNotice && <span className="successText">{bookingNotice}</span>}
          </aside>
        </section>
      )}

      {activeTab === 'History' && (
        <section className="card">
          <div className="sectionHeader">
            <div>
              <h2>Appointment history</h2>
              <p>Upcoming and previous visits are listed together.</p>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.date} at {appointment.time}</td>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'Documents' && (
        <section className="documentGrid">
          {documents.map((document) => (
            <article className="card documentCard" key={document.title}>
              <span className="badge">{document.type}</span>
              <h2>{document.title}</h2>
              <p>{document.doctor}</p>
              <span className="label">{document.date}</span>
              <button className="btn" type="button">View</button>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'Payments' && (
        <section className="splitGrid">
          <section className="card">
            <div className="sectionHeader">
              <div>
                <h2>Invoices</h2>
                <p>Outstanding balance: {formatCurrency(outstandingTotal)}</p>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.description}</td>
                    <td>{formatCurrency(invoice.amount)}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <form className="card formStack" onSubmit={handlePaymentSubmit}>
            <h2>Online payment</h2>
            <label className="field">
              <span className="label">Invoice</span>
              <select className="input" value={selectedInvoice} onChange={(event) => setSelectedInvoice(event.target.value)}>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>{invoice.id} - {formatCurrency(invoice.amount)}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Payment method</span>
              <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option>UPI</option>
                <option>Credit card</option>
                <option>Debit card</option>
                <option>Net banking</option>
              </select>
            </label>
            <button className="btn btnPrimary" type="submit">Pay online</button>
            {paymentNotice && <span className="successText">{paymentNotice}</span>}
          </form>
        </section>
      )}
    </section>
  )
}
