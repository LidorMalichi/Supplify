package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "first_name", nullable = false, length = 50)
    @NonNull
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    @NonNull
    private String lastName;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    @NonNull
    private String username;

    @Column(name = "password", nullable = false, length = 50)
    @NonNull
    private String password;

    @Column(name = "email", nullable = false, unique = true, length = 50)
    @NonNull
    private String email;

    @Column(name = "business_name", nullable = false, length = 50)
    @NonNull
    private String businessName;

    @Column(name = "phone", nullable = false, length = 10)
    @NonNull
    private String phone;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    @org.hibernate.annotations.UpdateTimestamp
    private LocalDateTime updatedAt;
}
