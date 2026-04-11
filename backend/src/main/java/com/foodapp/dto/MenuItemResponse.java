package com.foodapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private Double rating;
    private String imageUrl;
    private Boolean isAvailable;
    private Long restaurantId;
    private String restaurantName;
}
