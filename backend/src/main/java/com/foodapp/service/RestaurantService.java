package com.foodapp.service;

import com.foodapp.dto.RestaurantResponse;
import com.foodapp.dto.MenuItemResponse;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.MenuItem;
import com.foodapp.model.Restaurant;
import com.foodapp.repository.MenuItemRepository;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return mapToResponse(restaurant);
    }

    public List<RestaurantResponse> searchRestaurants(String query) {
        return restaurantRepository.searchRestaurants(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MenuItemResponse> getMenuByRestaurantId(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(item -> mapMenuItemToResponse(item, restaurant))
                .collect(Collectors.toList());
    }

    private RestaurantResponse mapToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .location(restaurant.getLocation())
                .imageUrl(restaurant.getImageUrl())
                .isOpen(restaurant.getIsOpen())
                .cuisine(restaurant.getCuisine())
                .rating(restaurant.getRating())
                .deliveryTime(restaurant.getDeliveryTime())
                .deliveryFee(restaurant.getDeliveryFee())
                .build();
    }

    private MenuItemResponse mapMenuItemToResponse(MenuItem item, Restaurant restaurant) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .imageUrl(item.getImageUrl())
                .isAvailable(item.getIsAvailable())
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getName())
                .build();
    }
}
