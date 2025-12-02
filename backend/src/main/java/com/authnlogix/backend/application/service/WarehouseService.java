package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.WarehouseRequest;
import com.authnlogix.backend.domain.model.Warehouse;
import com.authnlogix.backend.infrastructure.adapter.output.WarehouseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    // 1. Create Logic
    public Warehouse createWarehouse(WarehouseRequest request) {
        // Business Rule: No duplicate names allowed
        if (warehouseRepository.existsByName(request.getName())) {
            throw new RuntimeException("Warehouse with this name already exists");
        }

        // Map DTO to Entity
        Warehouse warehouse = Warehouse.builder()
                .name(request.getName())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        return warehouseRepository.save(warehouse);
    }

    // 2. Read Logic
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @Transactional
    public void deleteWarehouse(UUID id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Business Logic: Can we delete a warehouse with stock?
        // Option A: Block it
        if (!warehouse.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete warehouse with active products. Empty it first.");
        }

        // Option B: Soft Delete (Archive it)
        warehouse.setActive(false);
        warehouseRepository.save(warehouse);

        // Audit Log (If you enabled AOP for delete methods)
    }

    @Transactional
    public Warehouse updateWarehouse(java.util.UUID id, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setCapacity(request.getCapacity());

        // Note: We don't update Latitude/Longitude here for simplicity,
        // but you could add that if you want.

        return warehouseRepository.save(warehouse);
    }

}
