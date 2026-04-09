package com.foodapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private Double totalPrice;
    private Integer totalItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemResponse {
        private Long id;
        private Long menuItemId;
        private String menuItemName;
        private String menuItemImageUrl;
        private Double price;
        private Integer quantity;
        private Double subtotal;
        private String restaurantName;
        private Long restaurantId;
    }
}
