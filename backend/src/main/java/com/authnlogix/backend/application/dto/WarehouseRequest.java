package com.authnlogix.backend.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WarehouseRequest {

    @NotBlank(message = "Warehouse name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

}
