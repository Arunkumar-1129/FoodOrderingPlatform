package com.foodapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String imageUrl;
    private Boolean isOpen;
    private String cuisine;
    private Double rating;
    private Integer deliveryTime;
    private Double deliveryFee;
}
