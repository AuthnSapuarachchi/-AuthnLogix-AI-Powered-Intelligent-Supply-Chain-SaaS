package com.authnlogix.backend.infrastructure.adapter.output;

import com.authnlogix.backend.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>{

    boolean existsBySku(String sku);

}
