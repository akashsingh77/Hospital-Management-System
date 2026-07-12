const doctors = [
  { name: 'Dr. Iyer', specialty: 'Cardiology', availability: 'Available' },
  { name: 'Dr. Nair', specialty: 'Orthopedics', availability: 'In surgery' },
  { name: 'Dr. Rao', specialty: 'Neurology', availability: 'Available' },
]

export function DoctorsPage() {
  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <h1>Doctors</h1>
          <p>Monitor department coverage and availability.</p>
        </div>
      </header>

      <div className="listGrid">
        {doctors.map((doctor) => (
          <article className="card" key={doctor.name}>
            <h2>{doctor.name}</h2>
            <p>{doctor.specialty}</p>
            <span className="badge">{doctor.availability}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
