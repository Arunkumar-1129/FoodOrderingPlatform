package com.foodapp.controller;

import com.foodapp.dto.ApiResponse;
import com.foodapp.dto.OrderResponse;
import com.foodapp.dto.PlaceOrderRequest;
import com.foodapp.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            Authentication authentication,
            @Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse order = orderService.placeOrder(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(order, "Order placed successfully"));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(Authentication authentication) {
        List<OrderResponse> orders = orderService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            Authentication authentication,
            @PathVariable Long id) {
        OrderResponse order = orderService.cancelOrder(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(order, "Order cancelled successfully"));
    }
}
