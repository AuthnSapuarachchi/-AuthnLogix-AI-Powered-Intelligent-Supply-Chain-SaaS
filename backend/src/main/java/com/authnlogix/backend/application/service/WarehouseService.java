package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.WarehouseRequest;
import com.authnlogix.backend.domain.model.Warehouse;
import com.authnlogix.backend.infrastructure.adapter.output.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
                .build();

        return warehouseRepository.save(warehouse);
    }

    // 2. Read Logic
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

}
