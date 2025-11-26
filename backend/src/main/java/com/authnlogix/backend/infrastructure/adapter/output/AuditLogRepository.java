package com.authnlogix.backend.infrastructure.adapter.output;

import com.authnlogix.backend.domain.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    // We want to see the newest logs first
    List<AuditLog> findAllByOrderByTimestampDesc();

}
