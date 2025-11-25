package com.authnlogix.backend.infrastructure.adapter.output;

import com.authnlogix.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Spring Data Magic: It automatically writes the SQL for this
    Optional<User> findByEmail(String email);

    // Check if email exists for registration validation
    boolean existsByEmail(String email);

}
