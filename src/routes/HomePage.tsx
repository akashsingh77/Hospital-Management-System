import { Link } from 'react-router-dom'

const services = [
  'Emergency Care',
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Diagnostics',
  'Pharmacy',
]

const doctors = [
  { name: 'Dr. Kavya Iyer', specialty: 'Cardiology', timing: '9 AM - 2 PM' },
  { name: 'Dr. Arjun Nair', specialty: 'Orthopedics', timing: '10 AM - 4 PM' },
  { name: 'Dr. Meera Rao', specialty: 'Neurology', timing: '12 PM - 6 PM' },
]

const menuItems = ['Home', 'Services', 'Doctors', 'Appointments', 'Billing']

export function HomePage() {
  return (
    <section className="homePage">
      <header className="homeHero">
        <nav className="topMenu" aria-label="Home navigation menu">
          {menuItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="homeHeroContent" id="home">
          <span className="badge">Trusted care, every day</span>
          <h1>CityCare Hospital</h1>
          <p>
            A modern hospital management system for appointments, patient records,
            doctors, services, and billing.
          </p>
          <div className="homeActions">
            <Link className="btn btnPrimary" to="/login">Login</Link>
            <Link className="btn" to="/register">Register</Link>
          </div>
        </div>
      </header>

      <section className="homeSection" id="services">
        <div className="sectionTitle">
          <span className="badge">Our services</span>
          <h2>Care departments</h2>
        </div>
        <div className="serviceGrid">
          {services.map((service) => (
            <article className="card" key={service}>
              <h3>{service}</h3>
              <p>Coordinated care with appointments, records, and follow-up support.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="homeSection" id="doctors">
        <div className="sectionTitle">
          <span className="badge">Available doctors</span>
          <h2>Specialist team</h2>
        </div>
        <div className="listGrid">
          {doctors.map((doctor) => (
            <article className="card" key={doctor.name}>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
              <span className="badge">{doctor.timing}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
