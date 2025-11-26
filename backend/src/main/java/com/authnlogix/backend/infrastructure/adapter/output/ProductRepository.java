package com.authnlogix.backend.infrastructure.adapter.output;

import com.authnlogix.backend.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>{

    boolean existsBySku(String sku);

    // 1. Calculate Total Value (Price * Quantity for all items)
    // COALESCE handles nulls (returns 0 if table is empty)
    @Query("SELECT COALESCE(SUM(p.price * p.quantity), 0) FROM Product p")
    BigDecimal getTotalInventoryValue();

    // 2. Count items with low stock (e.g., less than 10)
    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity < 10")
    Long countLowStockItems();

    // 3. Group By Warehouse (For the Pie Chart)
    // This returns a list of Object arrays: ["Colombo Hub", 50]
    @Query("SELECT p.warehouse.name, COUNT(p) FROM Product p GROUP BY p.warehouse.name")
    List<Object[]> countProductsByWarehouse();

}
