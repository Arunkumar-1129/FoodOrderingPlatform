package com.foodapp.service;

import com.foodapp.dto.CartItemRequest;
import com.foodapp.dto.CartResponse;
import com.foodapp.exception.BadRequestException;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.*;
import com.foodapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartResponse addToCart(String userEmail, CartItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .user(user)
                    .items(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });

        // Check if item already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuItem().getId().equals(request.getMenuItemId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setSubtotal(item.getQuantity() * menuItem.getPrice());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .menuItem(menuItem)
                    .quantity(request.getQuantity())
                    .subtotal(request.getQuantity() * menuItem.getPrice())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(String userEmail, CartItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getMenuItem().getId().equals(request.getMenuItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(request.getQuantity());
            cartItem.setSubtotal(request.getQuantity() * cartItem.getMenuItem().getPrice());
            cartItemRepository.save(cartItem);
        }

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeFromCart(String userEmail, Long cartItemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        return mapToCartResponse(cart);
    }

    public CartResponse getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .user(user)
                    .items(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });

        return mapToCartResponse(cart);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }

    private CartResponse mapToCartResponse(Cart cart) {
        var items = cart.getItems().stream().map(item -> {
            MenuItem menuItem = item.getMenuItem();
            Restaurant restaurant = menuItem.getRestaurant();
            return CartResponse.CartItemResponse.builder()
                    .id(item.getId())
                    .menuItemId(menuItem.getId())
                    .menuItemName(menuItem.getName())
                    .menuItemImageUrl(menuItem.getImageUrl())
                    .price(menuItem.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(item.getSubtotal())
                    .restaurantName(restaurant.getName())
                    .restaurantId(restaurant.getId())
                    .build();
        }).collect(Collectors.toList());

        double totalPrice = items.stream().mapToDouble(CartResponse.CartItemResponse::getSubtotal).sum();
        int totalItems = items.stream().mapToInt(CartResponse.CartItemResponse::getQuantity).sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .totalPrice(totalPrice)
                .totalItems(totalItems)
                .build();
    }
}
