package com.authnlogix.backend.application.dto.analytics;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AnalyticsResponse {

    private BigDecimal totalInventoryValue;
    private Long totalProducts;
    private Long lowStockItems; // Items with quantity < 5
    private List<WarehouseStat> warehouseDistribution;

    @Data
    @Builder
    public static class WarehouseStat {
        private String warehouseName;
        private Long productCount;
    }

}
