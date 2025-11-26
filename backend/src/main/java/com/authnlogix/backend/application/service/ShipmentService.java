package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.ShipmentRequest;
import com.authnlogix.backend.domain.model.Product;
import com.authnlogix.backend.domain.model.Shipment;
import com.authnlogix.backend.domain.model.ShipmentStatus;
import com.authnlogix.backend.infrastructure.adapter.output.ProductRepository;
import com.authnlogix.backend.infrastructure.adapter.output.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ProductRepository productRepository;

    @Transactional // <--- CRITICAL: Starts a Database Transaction
    public Shipment createShipment(ShipmentRequest request) {

        // 1. Find the Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Validate Stock (Business Logic)
        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient Stock! Available: " + product.getQuantity());
        }

        // 3. Deduct Stock (The "Action")
        product.setQuantity(product.getQuantity() - request.getQuantity());
        productRepository.save(product); // Save the new quantity

        // 4. Create Shipment Record
        Shipment shipment = Shipment.builder()
                .product(product)
                .quantity(request.getQuantity())
                .destination(request.getDestination())
                .status(ShipmentStatus.SHIPPED)
                .shipmentDate(LocalDateTime.now())
                .build();

        return shipmentRepository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

}
