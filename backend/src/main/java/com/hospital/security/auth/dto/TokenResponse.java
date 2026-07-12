package com.hospital.security.auth.dto;

// Kept for compatibility if some client expects a different response name.
public class TokenResponse {
  private String token;

  public TokenResponse() {}

  public TokenResponse(String token) {
    this.token = token;
  }

  public String getToken() {
    return token;
  }
}

