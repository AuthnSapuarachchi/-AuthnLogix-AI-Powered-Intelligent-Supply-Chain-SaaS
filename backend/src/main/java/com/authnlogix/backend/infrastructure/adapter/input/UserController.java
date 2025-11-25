package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.service.UserService;
import com.authnlogix.backend.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        // Since SecurityConfig says "anyRequest().authenticated()",
        // this method is AUTOMATICALLY secured.
        // If the JWT is missing, this code never runs.
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
