package com.foodapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
}
