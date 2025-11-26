package com.authnlogix.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String action; // e.g. "CREATE_SHIPMENT"

    @Column(nullable = false)
    private String performedBy; // Email of the user

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 1000) // Allow longer text
    private String details; // e.g. "Shipment created for Product ID: ..."

}
