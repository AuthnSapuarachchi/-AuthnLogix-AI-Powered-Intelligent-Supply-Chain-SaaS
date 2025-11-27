package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.dto.ShipmentRequest;
import com.authnlogix.backend.application.service.ShipmentService;
import com.authnlogix.backend.domain.model.Shipment;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.authnlogix.backend.infrastructure.adapter.output.ShipmentRepository;
import com.authnlogix.backend.application.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    private final ShipmentService shipmentService;
    private final ShipmentRepository shipmentRepository; // Direct repo access for simple fetch is okay in read-only
    private final PdfService pdfService; // <--- Inject this

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')") // <--- Drivers are excluded
    public ResponseEntity<Shipment> createShipment(@RequestBody @Valid ShipmentRequest request) throws MessagingException {
        return ResponseEntity.ok(shipmentService.createShipment(request));
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable UUID id) {
        var shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        byte[] pdfBytes = pdfService.generateShipmentInvoice(shipment);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
