package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.domain.model.AuditLog;
import com.authnlogix.backend.infrastructure.adapter.output.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can see the history
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }

}
