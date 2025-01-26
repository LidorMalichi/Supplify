package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "business_supplier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSupplier {

    @EmbeddedId
    private BusinessSupplierId id;

    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @EqualsAndHashCode
    public static class BusinessSupplierId implements Serializable {
        @Column(name = "business_id")
        private int businessId;

        @Column(name = "supplier_id")
        private int supplierId;
    }

    // Constructor for convenienceS
    public BusinessSupplier(int businessId, int supplierId) {
        this.id = new BusinessSupplierId(businessId, supplierId);
    }

    // Optional: Add these if you need to map to the actual Business and Supplier entities
    /*
    @ManyToOne
    @MapsId("businessId")
    @JoinColumn(name = "business_id")
    private Business business;

    @ManyToOne
    @MapsId("supplierId")
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;
    */
}