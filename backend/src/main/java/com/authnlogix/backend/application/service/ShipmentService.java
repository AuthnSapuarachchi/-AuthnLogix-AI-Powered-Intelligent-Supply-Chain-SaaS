package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.ShipmentRequest;
import com.authnlogix.backend.domain.model.Product;
import com.authnlogix.backend.domain.model.Shipment;
import com.authnlogix.backend.domain.model.ShipmentStatus;
import com.authnlogix.backend.infrastructure.adapter.output.ProductRepository;
import com.authnlogix.backend.infrastructure.adapter.output.ShipmentRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;

    @Transactional
    public Shipment createShipment(ShipmentRequest request) throws MessagingException {

        // 1. Find Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Validate Stock
        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient Stock! Available: " + product.getQuantity());
        }

        // 3. Deduct Stock & Save (ONLY ONCE)
        product.setQuantity(product.getQuantity() - request.getQuantity());
        productRepository.save(product);

        // 4. Create Shipment
        Shipment shipment = Shipment.builder()
                .product(product)
                .quantity(request.getQuantity())
                .destination(request.getDestination())
                .status(ShipmentStatus.SHIPPED)
                .shipmentDate(LocalDateTime.now())
                .build();

        Shipment savedShipment = shipmentRepository.save(shipment);

        // 5. Notifications
        messagingTemplate.convertAndSend("/topic/inventory", "REFRESH_NEEDED");

        emailService.sendShipmentNotification(
                "manager@authnlogix.com",
                product.getName(),
                request.getQuantity(),
                request.getDestination()
        );

        // 6. Check for Low Stock (After deduction)
        if (product.getQuantity() < 10) {
            emailService.sendLowStockAlert(
                    "admin@authnlogix.com",
                    product.getName(),
                    product.getQuantity()
            );
        }

        return savedShipment;
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }
}