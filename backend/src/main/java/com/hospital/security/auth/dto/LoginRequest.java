package com.hospital.security.auth.dto;

import com.hospital.security.auth.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String password;

  // role is used because the frontend requires role selection
  @jakarta.validation.constraints.NotNull
  private UserRole role;


  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public UserRole getRole() {
    return role;
  }

  public void setRole(UserRole role) {
    this.role = role;
  }
}

