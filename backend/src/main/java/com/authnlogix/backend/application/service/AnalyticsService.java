package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.analytics.AnalyticsResponse;
import com.authnlogix.backend.infrastructure.adapter.output.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProductRepository productRepository;

    public AnalyticsResponse getDashboardStats() {
        // 1. Fetch Raw Data
        var totalValue = productRepository.getTotalInventoryValue();
        var totalCount = productRepository.count(); // Built-in JPA method
        var lowStock = productRepository.countLowStockItems();
        var distributionRaw = productRepository.countProductsByWarehouse();

        // 2. Map raw DB result (Object[]) to nice DTO
        List<AnalyticsResponse.WarehouseStat> stats = distributionRaw.stream()
                .map(obj -> AnalyticsResponse.WarehouseStat.builder()
                        .warehouseName((String) obj[0])
                        .productCount((Long) obj[1])
                        .build())
                .collect(Collectors.toList());

        // 3. Return final response
        return AnalyticsResponse.builder()
                .totalInventoryValue(totalValue)
                .totalProducts(totalCount)
                .lowStockItems(lowStock)
                .warehouseDistribution(stats)
                .build();
    }

}
