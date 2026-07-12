# Hospital Management Database

This folder contains the MySQL schema for the hospital management system.

## Tables

- `users`: Login accounts for admins, doctors, and patients.
- `departments`: Hospital departments such as Cardiology or Pediatrics.
- `patients`: Patient profile and emergency contact information.
- `doctors`: Doctor profile, department, specialization, and availability.
- `appointments`: Patient bookings with doctors.
- `medical_records`: Diagnoses, symptoms, treatment plans, and visit notes.
- `prescriptions`: Medicines prescribed from a medical record.
- `billing`: Patient invoices and payment status.

## Import

Run this from the project root after MySQL is installed:

```bash
mysql -u root -p < database/hospital_management_schema.sql
```

