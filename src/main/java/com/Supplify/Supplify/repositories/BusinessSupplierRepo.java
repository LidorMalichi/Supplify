package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.BusinessSupplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessSupplierRepo extends JpaRepository<BusinessSupplier, BusinessSupplier.BusinessSupplierId> {
}