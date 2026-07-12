package com.hospital.patient.service;

import com.hospital.patient.dto.PatientCreateRequest;
import com.hospital.patient.dto.PatientResponse;
import com.hospital.patient.dto.PatientUpdateRequest;
import com.hospital.patient.model.Patient;
import com.hospital.patient.repo.PatientRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PatientService {

  private final PatientRepository patientRepository;

  public PatientService(PatientRepository patientRepository) {
    this.patientRepository = patientRepository;
  }

  public List<PatientResponse> listPatients() {
    return patientRepository.findAll().stream().map(this::toResponse).toList();
  }

  public PatientResponse getPatientById(Integer id) {
    Patient patient = patientRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    return toResponse(patient);
  }

  public PatientResponse createPatient(PatientCreateRequest request) {
    // JWT role is enforced by Spring Security (@PreAuthorize on controller methods).



    Patient patient = new Patient();
    applyCreate(patient, request);

    Patient saved = patientRepository.save(patient);
    return toResponse(saved);
  }

  public PatientResponse updatePatient(Integer id, PatientUpdateRequest request) {


    Patient patient = patientRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

    applyUpdate(patient, request);

    Patient saved = patientRepository.save(patient);
    return toResponse(saved);
  }

  public void deletePatient(Integer id) {

    if (!patientRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
    }
    patientRepository.deleteById(id);
  }

  private void applyCreate(Patient patient, PatientCreateRequest r) {
    patient.setUserId(r.getUserId());
    patient.setPatientCode(r.getPatientCode());
    patient.setFirstName(r.getFirstName());
    patient.setLastName(r.getLastName());
    patient.setDateOfBirth(r.getDateOfBirth());
    patient.setGender(r.getGender());
    patient.setBloodGroup(r.getBloodGroup());
    patient.setPhone(r.getPhone());
    patient.setEmail(r.getEmail());
    patient.setAddress(r.getAddress());
    patient.setEmergencyContactName(r.getEmergencyContactName());
    patient.setEmergencyContactPhone(r.getEmergencyContactPhone());
    patient.setInsuranceProvider(r.getInsuranceProvider());
    patient.setInsurancePolicyNumber(r.getInsurancePolicyNumber());
  }

  private void applyUpdate(Patient patient, PatientUpdateRequest r) {
    patient.setUserId(r.getUserId());
    if (r.getPatientCode() != null) patient.setPatientCode(r.getPatientCode());
    if (r.getFirstName() != null) patient.setFirstName(r.getFirstName());
    if (r.getLastName() != null) patient.setLastName(r.getLastName());
    patient.setDateOfBirth(r.getDateOfBirth());
    patient.setGender(r.getGender());
    patient.setBloodGroup(r.getBloodGroup());
    if (r.getPhone() != null) patient.setPhone(r.getPhone());
    patient.setEmail(r.getEmail());
    patient.setAddress(r.getAddress());
    patient.setEmergencyContactName(r.getEmergencyContactName());
    patient.setEmergencyContactPhone(r.getEmergencyContactPhone());
    patient.setInsuranceProvider(r.getInsuranceProvider());
    patient.setInsurancePolicyNumber(r.getInsurancePolicyNumber());
  }

  private PatientResponse toResponse(Patient p) {
    PatientResponse res = new PatientResponse();
    res.setPatientId(p.getPatientId());
    res.setUserId(p.getUserId());
    res.setPatientCode(p.getPatientCode());
    res.setFirstName(p.getFirstName());
    res.setLastName(p.getLastName());
    res.setDateOfBirth(p.getDateOfBirth());
    res.setGender(p.getGender());
    res.setBloodGroup(p.getBloodGroup());
    res.setPhone(p.getPhone());
    res.setEmail(p.getEmail());
    res.setAddress(p.getAddress());
    res.setEmergencyContactName(p.getEmergencyContactName());
    res.setEmergencyContactPhone(p.getEmergencyContactPhone());
    res.setInsuranceProvider(p.getInsuranceProvider());
    res.setInsurancePolicyNumber(p.getInsurancePolicyNumber());
    return res;
  }
}

