package com.hospital.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  private final String secret;
  private final long expirationSeconds;

  public JwtUtil(
      @Value("${security.jwt.secret}") String secret,
      @Value("${security.jwt.expirationSeconds}") long expirationSeconds) {
    this.secret = secret;
    this.expirationSeconds = expirationSeconds;
  }

  private SecretKey signingKey() {
    // HS256 requires a sufficiently long key. Ensure secret length is adequate.
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(Integer userId, String role) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationSeconds * 1000L);

    return Jwts.builder()
        .subject(String.valueOf(userId))
        .claim("role", role)
        .issuedAt(now)
        .expiration(exp)
        .signWith(signingKey(), io.jsonwebtoken.SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean isTokenValid(String token) {
    try {
      parseAllClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public Claims getClaims(String token) {
    return parseAllClaims(token);
  }

  public Claims parseAllClaims(String token) {
    return Jwts.parser()
        .verifyWith(signingKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public Integer userIdFromToken(String token) {
    Claims claims = parseAllClaims(token);
    return Integer.valueOf(claims.getSubject());
  }

  public String roleFromToken(String token) {
    Claims claims = parseAllClaims(token);
    Object role = claims.get("role");
    return role == null ? null : role.toString();
  }
}

