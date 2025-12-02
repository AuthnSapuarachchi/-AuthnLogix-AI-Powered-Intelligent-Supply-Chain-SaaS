package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.dto.WarehouseRequest;
import com.authnlogix.backend.application.service.WarehouseService;
import com.authnlogix.backend.domain.model.Warehouse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // <--- ONLY ADMINS CAN PASS
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody @Valid WarehouseRequest request) {
        return ResponseEntity.ok(warehouseService.createWarehouse(request));
    }

    @GetMapping
    public ResponseEntity<List<Warehouse>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Critical: Only Admins can delete
    public ResponseEntity<Void> deleteWarehouse(@PathVariable UUID id) {
        warehouseService.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Warehouse> updateWarehouse(@PathVariable java.util.UUID id, @RequestBody @Valid WarehouseRequest request) {
        return ResponseEntity.ok(warehouseService.updateWarehouse(id, request));
    }

}
