package com.foodapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String location;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean isOpen = true;

    private String cuisine;

    private Double rating;

    private Integer deliveryTime; // in minutes

    private Double deliveryFee;
}
