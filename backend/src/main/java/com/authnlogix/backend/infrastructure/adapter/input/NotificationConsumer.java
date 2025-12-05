package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.service.EmailService;
import com.authnlogix.backend.domain.event.LowStockEvent;
import com.authnlogix.backend.domain.event.ShipmentCreatedEvent;
import com.authnlogix.backend.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * RabbitMQ Message Consumer
 * Listens to queues and processes email notification events
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final EmailService emailService;

    /**
     * Listens to the email queue for shipment notifications
     * Triggered when a new shipment is created
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_EMAIL)
    public void consumeShipmentMessage(ShipmentCreatedEvent event) {
        log.info("🐇 RabbitMQ: Received Shipment Event for product: {}", event.getProductName());

        try {
            emailService.sendShipmentNotification(
                    event.getToEmail(),
                    event.getProductName(),
                    event.getQuantity(),
                    event.getDestination());
            log.info("✅ Shipment notification email sent successfully to: {}", event.getToEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send shipment notification email: {}", e.getMessage(), e);
        }
    }

    /**
     * Listens to the low stock queue for inventory alerts
     * Triggered when product quantity falls below threshold
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE_LOW_STOCK)
    public void consumeLowStockMessage(LowStockEvent event) {
        log.warn("⚠️ RabbitMQ: Received Low Stock Alert for product: {} (Quantity: {})",
                event.getProductName(), event.getCurrentQuantity());

        try {
            emailService.sendLowStockAlert(
                    event.getToEmail(),
                    event.getProductName(),
                    event.getCurrentQuantity());
            log.info("✅ Low stock alert email sent successfully to: {}", event.getToEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send low stock alert email: {}", e.getMessage(), e);
        }
    }
}
