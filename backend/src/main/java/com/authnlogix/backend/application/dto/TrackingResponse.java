package com.authnlogix.backend.application.dto;

import com.authnlogix.backend.domain.model.ShipmentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TrackingResponse {

    private String shipmentId;
    private String productName;
    private Integer quantity;
    private ShipmentStatus status;
    private LocalDateTime shipmentDate;
    private String currentLocation; // Warehouse Location
    private Double latitude;
    private Double longitude;
}
