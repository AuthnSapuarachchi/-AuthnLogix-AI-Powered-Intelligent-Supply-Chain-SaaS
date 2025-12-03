package com.authnlogix.backend.application.service;

import com.authnlogix.backend.application.dto.ProductRequest;
import com.authnlogix.backend.domain.model.Product;
import com.authnlogix.backend.domain.model.Warehouse;
import com.authnlogix.backend.infrastructure.adapter.output.ProductRepository;
import com.authnlogix.backend.infrastructure.adapter.output.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional // Ensures Data Integrity
    public Product createProduct(ProductRequest request) {

        // 1. Check if SKU exists
        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with this SKU already exists");
        }

        // 2. Find the Warehouse
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // 3. --- BUSINESS LOGIC: CAPACITY CHECK ---
        // Calculate current total items in warehouse
        int currentStock = warehouse.getProducts().stream()
                .mapToInt(Product::getQuantity)
                .sum();

        if (currentStock + request.getQuantity() > warehouse.getCapacity()) {
            throw new RuntimeException("Warehouse capacity exceeded! Available space: "
                    + (warehouse.getCapacity() - currentStock));
        }

        // 4. Save Product
        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .warehouse(warehouse)
                .build();

        Product savedProduct = productRepository.save(product);

        // 2. BROADCAST THE EVENT
        // We send a simple string "UPDATE", but you could send the whole product JSON
        messagingTemplate.convertAndSend("/topic/inventory", "REFRESH_NEEDED");

        return savedProduct;
    }

    @Transactional
    public Product updateProductDetails(UUID id, String newName, BigDecimal newPrice) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Only update allowed fields
        product.setName(newName);
        product.setPrice(newPrice);

        // Note: We DO NOT update 'quantity' here. That must happen via
        // Shipments/Procurement logic.

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional
    public Product updateProduct(java.util.UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if warehouse is being changed
        if (!product.getWarehouse().getId().equals(request.getWarehouseId())) {
            Warehouse newWarehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));
            product.setWarehouse(newWarehouse);
        }

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());

        Product savedProduct = productRepository.save(product);

        // Notify WebSocket clients about the update
        messagingTemplate.convertAndSend("/topic/inventory", "REFRESH_NEEDED");

        return savedProduct;
    }

}
