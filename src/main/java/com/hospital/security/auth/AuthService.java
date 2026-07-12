package com.hospital.security.auth;

import com.hospital.security.JwtUtil;
import com.hospital.security.auth.dto.AuthResponse;
import com.hospital.security.auth.dto.LoginRequest;
import com.hospital.security.auth.dto.RegisterRequest;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private static final Logger log = LoggerFactory.getLogger(AuthService.class);

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
      throw new IllegalArgumentException("Email already in use");
    }

    User user = new User();
    user.setRole(request.getRole());
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPhone(null);
    user.setActive(true);
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

    User saved = userRepository.save(user);

    // auto-login after registration
    return buildAuthResponse(saved);
  }

  public AuthResponse login(LoginRequest request) {
    String email = request.getEmail();
    Object role = request.getRole();

    // Helpful for debugging from logs (role mismatches no longer block login)
    // but can still indicate frontend is sending unexpected role.


    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> {
          log.warn("Login failed: user not found for email={} role={}", email, role);
          return new IllegalArgumentException("Invalid email or password");
        });

    if (!user.isActive()) {
      log.warn("Login failed: account disabled userId={} email={} role={} requestedRole={}",
          user.getUserId(), user.getEmail(), user.getRole(), role);
      throw new IllegalArgumentException("Account is disabled");
    }

    // Allow login even if frontend-selected role mismatches.
    // Backend truth should be DB role + password validity.
    // This avoids "Invalid credentials" when user selects the wrong role on UI.

    boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

    if (!matches) {
      log.warn("Login failed: password mismatch userId={} email={} role={}", user.getUserId(), email, role);
      throw new IllegalArgumentException("Invalid email or password");
    }

    log.info("Login success userId={} email={} role={}", user.getUserId(), email, role);

    user.setLastLoginAt(Instant.now());
    userRepository.save(user);

    return buildAuthResponse(user);
  }


  private AuthResponse buildAuthResponse(User user) {
    String token = jwtUtil.generateToken(user.getUserId(), user.getRole().name());
    return new AuthResponse(token, user.getUserId(), user.getRole().name(), user.getFullName(), user.getEmail());
  }
}

