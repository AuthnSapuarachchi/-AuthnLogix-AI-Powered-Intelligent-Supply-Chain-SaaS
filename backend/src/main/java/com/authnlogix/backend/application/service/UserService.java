package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.AuthenticationResponse;
import com.authnlogix.backend.application.dto.LoginRequest;
import com.authnlogix.backend.application.dto.RegisterRequest;
import com.authnlogix.backend.domain.model.User;
import com.authnlogix.backend.infrastructure.adapter.output.UserRepository;
import com.authnlogix.backend.infrastructure.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // Injects UserRepository automatically
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found")); // Should not happen if auth passed

        // 3. Generate Token
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
