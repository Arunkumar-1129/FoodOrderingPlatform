package com.foodapp.controller;

import com.foodapp.dto.ApiResponse;
import com.foodapp.dto.MenuItemResponse;
import com.foodapp.dto.RestaurantResponse;
import com.foodapp.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAllRestaurants() {
        List<RestaurantResponse> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(ApiResponse.success(restaurants));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success(restaurant));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> searchRestaurants(@RequestParam String query) {
        List<RestaurantResponse> restaurants = restaurantService.searchRestaurants(query);
        return ResponseEntity.ok(ApiResponse.success(restaurants));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getRestaurantMenu(@PathVariable Long id) {
        List<MenuItemResponse> menuItems = restaurantService.getMenuByRestaurantId(id);
        return ResponseEntity.ok(ApiResponse.success(menuItems));
    }
}
