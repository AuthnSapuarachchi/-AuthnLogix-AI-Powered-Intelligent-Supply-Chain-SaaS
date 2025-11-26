package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.dto.ShipmentRequest;
import com.authnlogix.backend.application.service.ShipmentService;
import com.authnlogix.backend.domain.model.Shipment;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    private final ShipmentService shipmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')") // <--- Drivers are excluded
    public ResponseEntity<Shipment> createShipment(@RequestBody @Valid ShipmentRequest request) {
        return ResponseEntity.ok(shipmentService.createShipment(request));
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }
}
