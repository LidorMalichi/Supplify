package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.Services.ProductService;
import com.Supplify.Supplify.entities.Product;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.List;
@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    @PostMapping("/business/{businessId}")
    public ResponseEntity<?> createProduct(
            @RequestBody Product product,
            @PathVariable Integer businessId) {
        try {
            Product createdProduct = productService.createProduct(product, businessId);
            return ResponseEntity.status(201).body(createdProduct);
        } catch (Exception e) {
            logger.error("Error creating product: ", e);
            return ResponseEntity.status(500)
                    .body("Internal Server Error: " + e.getMessage());
        }
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<Product>> getProductsByBusinessId(@PathVariable Integer businessId) {
        try {
            List<Product> products = productService.getProductsByBusinessId(businessId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products: ", e);
            return ResponseEntity.status(500).build();
        }
    }
}