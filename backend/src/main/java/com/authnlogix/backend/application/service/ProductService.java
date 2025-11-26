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

import java.util.List;

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

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

}
