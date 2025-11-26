package com.authnlogix.backend.infrastructure.config;

import com.authnlogix.backend.domain.model.AuditLog;
import com.authnlogix.backend.infrastructure.adapter.output.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect // <--- Tells Spring: "This is a listener"
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    // Listen to createWarehouse, createProduct, createShipment
    // Syntax: execution(* PACKAGE.CLASS.METHOD(..))
    @AfterReturning(pointcut = "execution(* com.authnlogix.backend.application.service.*.create*(..))", returning = "result")
    public void logCreation(JoinPoint joinPoint, Object result) {
        try {
            // 1. Get current user
            String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

            // 2. Get method name (e.g., createShipment)
            String methodName = joinPoint.getSignature().getName();

            // 3. Convert method name to readable action (createShipment -> CREATE_SHIPMENT)
            String action = camelToSnake(methodName).toUpperCase();

            // 4. Save Log
            AuditLog log = AuditLog.builder()
                    .action(action)
                    .performedBy(currentUser)
                    .timestamp(LocalDateTime.now())
                    .details("Successfully executed " + methodName)
                    .build();

            auditLogRepository.save(log);
            System.out.println("📝 Audit Logged: " + action + " by " + currentUser);

        } catch (Exception e) {
            // Don't crash the app if logging fails
            System.err.println("Failed to write audit log: " + e.getMessage());
        }
    }

    // Helper to format strings
    private String camelToSnake(String str) {
        return str.replaceAll("([a-z])([A-Z]+)", "$1_$2");
    }

}
