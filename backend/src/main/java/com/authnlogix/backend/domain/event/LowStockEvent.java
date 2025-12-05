package com.authnlogix.backend.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Event published to RabbitMQ when product stock falls below threshold
 * Used to trigger low stock alert emails to administrators
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String toEmail;
    private String productName;
    private Integer currentQuantity;
}
