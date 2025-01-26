package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "supplier_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierProduct {

    @EmbeddedId
    private SupplierProductId id;

    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @EqualsAndHashCode
    public static class SupplierProductId implements Serializable {
        @Column(name = "supplier_id")
        private int supplierId;

        @Column(name = "product_id")
        private int productId;
    }

    public SupplierProduct(int supplierId, int productId) {
        this.id = new SupplierProductId(supplierId, productId);
    }
}
