package com.authnlogix.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.envers.Audited;

import java.util.List;

@Entity
@Table(name = "warehouses") // Plural table name standard
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Audited // <--- Add this
@SQLRestriction("active = true")
public class Warehouse extends BaseEntity{

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Colombo Main Hub"

    @Column(nullable = false)
    private String location; // e.g., "Colombo 03"

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private Integer capacity; // e.g., 10000

    // Later we will add a relationship to Products here
    // One Warehouse -> Many Products
    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL)
    private List<Product> products;

}
