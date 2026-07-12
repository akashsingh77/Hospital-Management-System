type Invoice = {
  id: string
  patient: string
  doctor: string
  department: string
  date: string
  consultationFee: number
  services: Array<{ label: string; amount: number }>
  paymentStatus: 'Paid' | 'Pending' | 'Partially paid'
}

const invoices: Invoice[] = [
  {
    id: 'INV-1042',
    patient: 'Aarav Mehta',
    doctor: 'Dr. Kavya Iyer',
    department: 'Cardiology',
    date: '2026-07-08',
    consultationFee: 1200,
    services: [
      { label: 'ECG', amount: 1800 },
      { label: 'Lipid profile', amount: 2400 },
      { label: 'Medication review', amount: 600 },
    ],
    paymentStatus: 'Pending',
  },
  {
    id: 'INV-1043',
    patient: 'Neha Sharma',
    doctor: 'Dr. Meera Nair',
    department: 'Orthopedics',
    date: '2026-07-06',
    consultationFee: 1000,
    services: [
      { label: 'X-ray', amount: 1500 },
      { label: 'Cast review', amount: 850 },
    ],
    paymentStatus: 'Paid',
  },
  {
    id: 'INV-1044',
    patient: 'Rohan Gupta',
    doctor: 'Dr. Arjun Rao',
    department: 'Neurology',
    date: '2026-07-05',
    consultationFee: 1500,
    services: [
      { label: 'MRI review', amount: 6200 },
      { label: 'Follow-up assessment', amount: 900 },
    ],
    paymentStatus: 'Partially paid',
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getInvoiceTotal(invoice: Invoice) {
  return invoice.consultationFee + invoice.services.reduce((total, service) => total + service.amount, 0)
}

function getInvoiceText(invoice: Invoice) {
  const serviceLines = invoice.services
    .map((service) => `${service.label}: ${formatCurrency(service.amount)}`)
    .join('\n')

  return [
    'CareDesk Hospital Management',
    `Invoice: ${invoice.id}`,
    `Date: ${invoice.date}`,
    '',
    `Patient: ${invoice.patient}`,
    `Doctor: ${invoice.doctor}`,
    `Department: ${invoice.department}`,
    '',
    `Consultation fee: ${formatCurrency(invoice.consultationFee)}`,
    serviceLines,
    '',
    `Total: ${formatCurrency(getInvoiceTotal(invoice))}`,
    `Payment status: ${invoice.paymentStatus}`,
  ].join('\n')
}

function downloadInvoice(invoice: Invoice) {
  const blob = new Blob([getInvoiceText(invoice)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${invoice.id}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

function printInvoice(invoice: Invoice) {
  const printable = window.open('', '_blank', 'width=720,height=900')

  if (!printable) {
    window.print()
    return
  }

  printable.document.write(`
    <html>
      <head>
        <title>${invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
          h1 { margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border-bottom: 1px solid #d1d5db; padding: 10px; text-align: left; }
          .total { font-size: 20px; font-weight: 700; margin-top: 24px; }
        </style>
      </head>
      <body>
        <h1>CareDesk Invoice</h1>
        <p>${invoice.id} | ${invoice.date}</p>
        <p><strong>Patient:</strong> ${invoice.patient}</p>
        <p><strong>Doctor:</strong> ${invoice.doctor}</p>
        <p><strong>Department:</strong> ${invoice.department}</p>
        <table>
          <thead>
            <tr><th>Item</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>Consultation fee</td><td>${formatCurrency(invoice.consultationFee)}</td></tr>
            ${invoice.services.map((service) => `<tr><td>${service.label}</td><td>${formatCurrency(service.amount)}</td></tr>`).join('')}
          </tbody>
        </table>
        <p class="total">Total: ${formatCurrency(getInvoiceTotal(invoice))}</p>
        <p><strong>Payment status:</strong> ${invoice.paymentStatus}</p>
      </body>
    </html>
  `)
  printable.document.close()
  printable.focus()
  printable.print()
}

export function BillingPage() {
  const paidTotal = invoices
    .filter((invoice) => invoice.paymentStatus === 'Paid')
    .reduce((total, invoice) => total + getInvoiceTotal(invoice), 0)
  const pendingTotal = invoices
    .filter((invoice) => invoice.paymentStatus !== 'Paid')
    .reduce((total, invoice) => total + getInvoiceTotal(invoice), 0)

  return (
    <section className="pageStack">
      <header className="pageHeader">
        <div>
          <h1>Billing</h1>
          <p>Display consultation fees, payment status, and invoice actions.</p>
        </div>
      </header>

      <div className="kpiGrid">
        <article className="card">
          <span className="metricLabel">Paid amount</span>
          <strong className="metricValue">{formatCurrency(paidTotal)}</strong>
        </article>
        <article className="card">
          <span className="metricLabel">Pending amount</span>
          <strong className="metricValue">{formatCurrency(pendingTotal)}</strong>
        </article>
        <article className="card">
          <span className="metricLabel">Invoices</span>
          <strong className="metricValue">{invoices.length}</strong>
        </article>
        <article className="card">
          <span className="metricLabel">Consultation fees</span>
          <strong className="metricValue">
            {formatCurrency(invoices.reduce((total, invoice) => total + invoice.consultationFee, 0))}
          </strong>
        </article>
      </div>

      <section className="card">
        <div className="sectionHeader">
          <div>
            <h2>Invoices</h2>
            <p>Download or print invoices from the actions column.</p>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Consultation fee</th>
              <th>Total</th>
              <th>Payment status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <strong>{invoice.id}</strong>
                  <span className="tableSubtext">{invoice.date}</span>
                </td>
                <td>{invoice.patient}</td>
                <td>
                  {invoice.doctor}
                  <span className="tableSubtext">{invoice.department}</span>
                </td>
                <td>{formatCurrency(invoice.consultationFee)}</td>
                <td>{formatCurrency(getInvoiceTotal(invoice))}</td>
                <td>
                  <span className={`statusPill status${invoice.paymentStatus.replace(/\s/g, '')}`}>
                    {invoice.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="actionGroup">
                    <button className="btn" type="button" onClick={() => downloadInvoice(invoice)}>Download</button>
                    <button className="btn" type="button" onClick={() => printInvoice(invoice)}>Print</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  )
}
