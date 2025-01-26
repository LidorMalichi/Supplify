package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierProductRepo extends JpaRepository<SupplierProduct, SupplierProduct.SupplierProductId> {
    List<SupplierProduct> findByIdSupplierIdIn(List<Integer> supplierIds);
}
