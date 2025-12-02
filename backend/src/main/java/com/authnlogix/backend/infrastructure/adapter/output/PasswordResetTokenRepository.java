package com.authnlogix.backend.infrastructure.adapter.output;

import com.authnlogix.backend.domain.model.PasswordResetToken;
import com.authnlogix.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user); // Clean up old tokens
}
