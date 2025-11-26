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

}
