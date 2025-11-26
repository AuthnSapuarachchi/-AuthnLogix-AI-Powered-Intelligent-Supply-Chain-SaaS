package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.dto.TrackingResponse;
import com.authnlogix.backend.infrastructure.adapter.output.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/tracking")
@RequiredArgsConstructor
public class PublicTrackingController {

    private final ShipmentRepository shipmentRepository;

    @GetMapping("/{id}")
    public ResponseEntity<TrackingResponse> trackShipment(@PathVariable UUID id) {
        return shipmentRepository.findById(id)
                .map(shipment -> TrackingResponse.builder()
                        .shipmentId(shipment.getId().toString())
                        .productName(shipment.getProduct().getName())
                        .quantity(shipment.getQuantity())
                        .status(shipment.getStatus())
                        .shipmentDate(shipment.getShipmentDate())
                        // We show the originating warehouse location for now
                        .currentLocation(shipment.getProduct().getWarehouse().getLocation())
                        .latitude(shipment.getProduct().getWarehouse().getLatitude())
                        .longitude(shipment.getProduct().getWarehouse().getLongitude())
                        .build()
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
