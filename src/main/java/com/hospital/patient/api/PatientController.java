package com.hospital.patient.api;

import com.hospital.patient.dto.PatientCreateRequest;
import com.hospital.patient.dto.PatientResponse;
import com.hospital.patient.dto.PatientUpdateRequest;
import com.hospital.patient.service.PatientService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @GetMapping
  public List<PatientResponse> getAll() {
    return patientService.listPatients();
  }

  @GetMapping("/{id}")
  public PatientResponse getById(@PathVariable Integer id) {
    return patientService.getPatientById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  public PatientResponse create(@Valid @RequestBody PatientCreateRequest request) {
    return patientService.createPatient(request);
  }

  @PutMapping("/{id}")
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  public PatientResponse update(@PathVariable Integer id,
                                  @Valid @RequestBody PatientUpdateRequest request) {
    return patientService.updatePatient(id, request);
  }

  @DeleteMapping("/{id}")
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Integer id) {
    patientService.deletePatient(id);
  }
}

