package com.Supplify.Supplify.Services;

import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.entities.SupplierProduct;
import com.Supplify.Supplify.repositories.SupplierProductRepo;
import com.Supplify.Supplify.repositories.ProductRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final SupplierProductRepo supplierProductRepo;
    private final SupplierService supplierService;

    public Product createProduct(Product product, int supplierId) {
        Product savedProduct = productRepo.save(product);
        SupplierProduct supplierProduct = new SupplierProduct(supplierId, savedProduct.getId());
        supplierProductRepo.save(supplierProduct);
        return savedProduct;
    }

    public List<Product> getProductsByBusinessId(Integer businessId) {
        List<Supplier> suppliers = supplierService.getSuppliersByBusinessId(businessId);
        List<Integer> supplierIds = suppliers.stream()
                .map(Supplier::getSupplierId)
                .collect(Collectors.toList());
        List<SupplierProduct> supplierProducts = supplierProductRepo.findByIdSupplierIdIn(supplierIds);
        List<Integer> productIds = supplierProducts.stream()
                .map(sp -> sp.getId().getProductId())
                .collect(Collectors.toList());
        return productRepo.findAllById(productIds);
    }
}