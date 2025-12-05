package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.ShipmentRequest;
import com.authnlogix.backend.domain.event.LowStockEvent;
import com.authnlogix.backend.domain.event.ShipmentCreatedEvent;
import com.authnlogix.backend.domain.model.Product;
import com.authnlogix.backend.domain.model.Shipment;
import com.authnlogix.backend.domain.model.ShipmentStatus;
import com.authnlogix.backend.infrastructure.adapter.output.ProductRepository;
import com.authnlogix.backend.infrastructure.adapter.output.ShipmentRepository;
import com.authnlogix.backend.infrastructure.config.RabbitMQConfig;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AmqpTemplate rabbitTemplate;

    private static final int LOW_STOCK_THRESHOLD = 10;

    @Transactional
    public Shipment createShipment(ShipmentRequest request) throws MessagingException {
        log.info("Creating shipment for product ID: {}, quantity: {}", request.getProductId(), request.getQuantity());

        // 1. Find Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + request.getProductId()));

        // 2. Validate Stock
        if (product.getQuantity() < request.getQuantity()) {
            log.warn("Insufficient stock for product: {}. Available: {}, Requested: {}",
                    product.getName(), product.getQuantity(), request.getQuantity());
            throw new RuntimeException("Insufficient Stock! Available: " + product.getQuantity());
        }

        // 3. Deduct Stock & Save
        int previousQuantity = product.getQuantity();
        product.setQuantity(product.getQuantity() - request.getQuantity());
        productRepository.save(product);
        log.info("Stock deducted for {}: {} → {}", product.getName(), previousQuantity, product.getQuantity());

        // 4. Create Shipment
        Shipment shipment = Shipment.builder()
                .product(product)
                .quantity(request.getQuantity())
                .destination(request.getDestination())
                .status(ShipmentStatus.SHIPPED)
                .shipmentDate(LocalDateTime.now())
                .build();

        Shipment savedShipment = shipmentRepository.save(shipment);
        log.info("Shipment created successfully: ID {}", savedShipment.getId());

        // 5. WebSocket Notification (Real-time UI update)
        messagingTemplate.convertAndSend("/topic/inventory", "REFRESH_NEEDED");

        // 6. RabbitMQ Event: Shipment Notification
        publishShipmentEvent(product, request);

        // 7. RabbitMQ Event: Low Stock Alert (if needed)
        if (product.getQuantity() < LOW_STOCK_THRESHOLD) {
            publishLowStockEvent(product);
        }

        return savedShipment;
    }

    /**
     * Publishes shipment created event to RabbitMQ
     */
    private void publishShipmentEvent(Product product, ShipmentRequest request) {
        try {
            ShipmentCreatedEvent shipmentEvent = ShipmentCreatedEvent.builder()
                    .toEmail("manager@authnlogix.com")
                    .productName(product.getName())
                    .quantity(request.getQuantity())
                    .destination(request.getDestination())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY,
                    shipmentEvent);
            log.info("🚀 Shipment event published to RabbitMQ for product: {}", product.getName());
        } catch (Exception e) {
            log.error("Failed to publish shipment event to RabbitMQ: {}", e.getMessage(), e);
            // Don't fail the transaction - email is non-critical
        }
    }

    /**
     * Publishes low stock alert event to RabbitMQ
     */
    private void publishLowStockEvent(Product product) {
        try {
            LowStockEvent lowStockEvent = LowStockEvent.builder()
                    .toEmail("admin@authnlogix.com")
                    .productName(product.getName())
                    .currentQuantity(product.getQuantity())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    RabbitMQConfig.LOW_STOCK_ROUTING_KEY,
                    lowStockEvent);
            log.warn("⚠️ Low stock alert published to RabbitMQ for product: {} (Quantity: {})",
                    product.getName(), product.getQuantity());
        } catch (Exception e) {
            log.error("Failed to publish low stock alert to RabbitMQ: {}", e.getMessage(), e);
            // Don't fail the transaction - email is non-critical
        }
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }
}