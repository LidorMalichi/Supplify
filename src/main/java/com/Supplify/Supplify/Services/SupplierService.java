package com.Supplify.Supplify.Services;

import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.Supplify.Supplify.entities.Supplier;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class SupplierService {
    private final SupplierRepo supplierRepo;
    private final BusinessSupplierRepo businessSupplierRepo;

    @Transactional
    public Supplier createSupplier(Supplier supplier, Integer businessId) {

        Supplier savedSupplier = supplierRepo.save(supplier);

        BusinessSupplier businessSupplier = new BusinessSupplier(businessId, savedSupplier.getSupplierId());
        businessSupplierRepo.save(businessSupplier);

        return savedSupplier;
    }
    public List<Supplier> getAllSuppliers() {
        return supplierRepo.findAll();
    }

    public Supplier getSupplierById(Integer id) {
        return supplierRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
}