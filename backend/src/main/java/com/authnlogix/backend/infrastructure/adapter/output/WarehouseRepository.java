package com.authnlogix.backend.infrastructure.adapter.output;

import com.authnlogix.backend.domain.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, UUID>{

    // Spring Data JPA automatically writes the SQL for this method name:
    // SELECT count(*) > 0 FROM warehouses WHERE name = ?
    boolean existsByName(String name);

}
