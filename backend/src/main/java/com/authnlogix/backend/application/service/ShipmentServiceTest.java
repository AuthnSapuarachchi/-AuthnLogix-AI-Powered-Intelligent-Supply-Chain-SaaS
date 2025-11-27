package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.ShipmentRequest;
import com.authnlogix.backend.domain.model.Product;
import com.authnlogix.backend.domain.model.Shipment;
import com.authnlogix.backend.infrastructure.adapter.output.ProductRepository;
import com.authnlogix.backend.infrastructure.adapter.output.ShipmentRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Enables Mockito
public class ShipmentServiceTest {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private ShipmentRepository shipmentRepository;

    @InjectMocks
    private ShipmentService shipmentService; // Injects the mocks into here

    @Test
    void createShipment_ShouldSucceed_WhenStockIsSufficient() throws MessagingException {
        // 1. Arrange (Setup data)
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .quantity(100) // Initial stock
                .price(java.math.BigDecimal.TEN)
                .build();

        ShipmentRequest request = new ShipmentRequest();
        request.setProductId(productId);
        request.setQuantity(10);
        request.setDestination("Kandy");

        // Teach the Mock what to do: "If someone asks for this ID, return this product"
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Teach the Mock: "If someone saves a shipment, just return it"
        when(shipmentRepository.save(any(Shipment.class))).thenAnswer(i -> i.getArguments()[0]);

        // 2. Act (Run the method)
        Shipment result = shipmentService.createShipment(request);

        // 3. Assert (Verify results)
        assertNotNull(result);
        assertEquals(90, product.getQuantity()); // 100 - 10 = 90
        verify(productRepository, times(1)).save(product); // Verify stock was updated
    }

    @Test
    void createShipment_ShouldFail_WhenStockIsInsufficient() {
        // 1. Arrange
        UUID productId = UUID.randomUUID();
        Product product = Product.builder()
                .quantity(5) // Only 5 in stock
                .build();

        ShipmentRequest request = new ShipmentRequest();
        request.setProductId(productId);
        request.setQuantity(10); // Trying to buy 10

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // 2. Act & Assert
        // Expect a RuntimeException
        Exception exception = assertThrows(RuntimeException.class, () -> {
            shipmentService.createShipment(request);
        });

        // Check error message
        assertTrue(exception.getMessage().contains("Insufficient Stock"));

        // Ensure we NEVER saved the product (Inventory should not change)
        verify(productRepository, never()).save(any());
    }
}
