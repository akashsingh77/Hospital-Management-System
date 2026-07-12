package com.hospital.security.auth.dto;

public class AuthResponse {

  private final String token;
  private final Integer userId;
  private final String role;
  private final String fullName;
  private final String email;

  public AuthResponse(String token, Integer userId, String role, String fullName, String email) {
    this.token = token;
    this.userId = userId;
    this.role = role;
    this.fullName = fullName;
    this.email = email;
  }

  public String getToken() {
    return token;
  }

  public Integer getUserId() {
    return userId;
  }

  public String getRole() {
    return role;
  }

  public String getFullName() {
    return fullName;
  }

  public String getEmail() {
    return email;
  }
}

