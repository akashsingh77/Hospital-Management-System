package com.hospital.patient.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "patient_id")
  private Integer patientId;

  @Column(name = "user_id", unique = true)
  private Integer userId;

  @Column(name = "patient_code", nullable = false, unique = true, length = 30)
  private String patientCode;

  @Column(name = "first_name", nullable = false, length = 80)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 80)
  private String lastName;

  @Column(name = "date_of_birth", nullable = false)
  private LocalDate dateOfBirth;

  @Enumerated(EnumType.STRING)
  @Column(name = "gender", nullable = false)
  private Gender gender;

  @Column(name = "blood_group")
  private String bloodGroup;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  @Column(name = "email", length = 150)
  private String email;

  @Column(name = "address")
  private String address;

  @Column(name = "emergency_contact_name", length = 120)
  private String emergencyContactName;

  @Column(name = "emergency_contact_phone", length = 20)
  private String emergencyContactPhone;

  @Column(name = "insurance_provider", length = 120)
  private String insuranceProvider;

  @Column(name = "insurance_policy_number", length = 80)
  private String insurancePolicyNumber;

  public Integer getPatientId() {
    return patientId;
  }

  public void setPatientId(Integer patientId) {
    this.patientId = patientId;
  }

  public Integer getUserId() {
    return userId;
  }

  public void setUserId(Integer userId) {
    this.userId = userId;
  }

  public String getPatientCode() {
    return patientCode;
  }

  public void setPatientCode(String patientCode) {
    this.patientCode = patientCode;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public Gender getGender() {
    return gender;
  }

  public void setGender(Gender gender) {
    this.gender = gender;
  }

  public String getBloodGroup() {
    return bloodGroup;
  }

  public void setBloodGroup(String bloodGroup) {
    this.bloodGroup = bloodGroup;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getEmergencyContactName() {
    return emergencyContactName;
  }

  public void setEmergencyContactName(String emergencyContactName) {
    this.emergencyContactName = emergencyContactName;
  }

  public String getEmergencyContactPhone() {
    return emergencyContactPhone;
  }

  public void setEmergencyContactPhone(String emergencyContactPhone) {
    this.emergencyContactPhone = emergencyContactPhone;
  }

  public String getInsuranceProvider() {
    return insuranceProvider;
  }

  public void setInsuranceProvider(String insuranceProvider) {
    this.insuranceProvider = insuranceProvider;
  }

  public String getInsurancePolicyNumber() {
    return insurancePolicyNumber;
  }

  public void setInsurancePolicyNumber(String insurancePolicyNumber) {
    this.insurancePolicyNumber = insurancePolicyNumber;
  }
}

