package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "product_name", nullable = false, length = 50)
    private String productName;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "base_price", nullable = false)
    private double basePrice;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Column(name = "barcode", nullable = false, length = 45)
    private String barcode;

    @Column(name = "selling_price", nullable = false)
    private double sellingPrice;

    @Column(name = "requested_stock", nullable = false)
    private int requestedStock;

    @Column(name = "image_path", nullable = true, length = 255)
    private String imagePath;
}