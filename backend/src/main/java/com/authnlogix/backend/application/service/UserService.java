package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.AuthenticationResponse;
import com.authnlogix.backend.application.dto.LoginRequest;
import com.authnlogix.backend.application.dto.RegisterRequest;
import com.authnlogix.backend.domain.model.User;
import com.authnlogix.backend.infrastructure.adapter.output.PasswordResetTokenRepository;
import com.authnlogix.backend.infrastructure.adapter.output.UserRepository;
import com.authnlogix.backend.infrastructure.config.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.authnlogix.backend.domain.model.PasswordResetToken;
import java.util.UUID;


import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // Injects UserRepository automatically
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final long LOCK_TIME_DURATION = 15; // Minutes
    private final PasswordResetTokenRepository tokenRepository;

    public String register(RegisterRequest request) {
        // 1. Check if user exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        // 2. Build User Entity
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();

        // 3. Save to DB
        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        // 1. This method does the heavy lifting:
        //    - It hashes the request password
        //    - Checks it against the DB
        //    - Throws 'BadCredentialsException' if it fails
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. If we get here, the user is valid. Find them to generate token.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found")); // Should not happen if auth passed

        // 2. Check if Locked
        if (!user.isAccountNonLocked()) {
            if (unlockWhenTimeExpired(user)) {
                // If time passed, unlock automatically
            } else {
                throw new LockedException("Your account has been locked due to 3 failed attempts. Try again in 15 minutes.");
            }
        }

        try{

            // 3. Attempt Authentication
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // 4. If Success -> Reset Counters
            if (user.getFailedAttempts() > 0) {
                resetFailedAttempts(user);
            }

            // 3. Generate Token
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .role(user.getRole())
                    .build();

        } catch (BadCredentialsException e) {
            // 5. If Fail -> Increase Counter
            increaseFailedAttempts(user);
            throw e; // Re-throw to tell Controller it failed
        }


    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- 1. REQUEST RESET ---
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete any old tokens for this user (clean up)
        // Note: You might need to make this specific delete query transactional or handle it manually
        // For simplicity, let's just create a new one.

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15)) // 15 mins TTL
                .build();

        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    // --- 2. PERFORM RESET ---
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();

        // Update Password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Unlock account if it was locked!
        user.setAccountNonLocked(true);
        user.setFailedAttempts(0);
        user.setLockTime(null);

        userRepository.save(user);

        // Delete used token
        tokenRepository.delete(resetToken);
    }

    // --- HELPER METHODS ---

    private void increaseFailedAttempts(User user) {
        int newFailAttempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(newFailAttempts);

        if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
            lockUserAccount(user);
        }
        userRepository.save(user);
    }

    private void resetFailedAttempts(User user) {
        user.setFailedAttempts(0);
        user.setAccountNonLocked(true);
        user.setLockTime(null);
        userRepository.save(user);
    }

    private void lockUserAccount(User user) {
        user.setAccountNonLocked(false);
        user.setLockTime(LocalDateTime.now());
        userRepository.save(user);
    }

    private boolean unlockWhenTimeExpired(User user) {
        long lockTimeInMillis = user.getLockTime().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
        long currentTimeInMillis = System.currentTimeMillis();

        if (lockTimeInMillis + (LOCK_TIME_DURATION * 60 * 1000) < currentTimeInMillis) {
            user.setAccountNonLocked(true);
            user.setLockTime(null);
            user.setFailedAttempts(0);
            userRepository.save(user);
            return true;
        }
        return false;
    }

}
