package com.foodapp.controller;

import com.foodapp.dto.ApiResponse;
import com.foodapp.dto.CartItemRequest;
import com.foodapp.dto.CartResponse;
import com.foodapp.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        CartResponse cart = cartService.getCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        CartResponse cart = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item added to cart"));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        CartResponse cart = cartService.updateCartItem(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Cart updated"));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            Authentication authentication,
            @PathVariable Long itemId) {
        CartResponse cart = cartService.removeFromCart(authentication.getName(), itemId);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Cart cleared successfully"));
    }
}
