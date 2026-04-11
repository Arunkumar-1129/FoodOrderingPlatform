package com.foodapp.service;

import com.foodapp.dto.OrderResponse;
import com.foodapp.dto.PlaceOrderRequest;
import com.foodapp.exception.BadRequestException;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.*;
import com.foodapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public OrderResponse placeOrder(String userEmail, PlaceOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Group cart items by restaurant — for simplicity, all items must be from the same restaurant
        Restaurant restaurant = cart.getItems().get(0).getMenuItem().getRestaurant();
        boolean differentRestaurant = cart.getItems().stream()
                .anyMatch(item -> !item.getMenuItem().getRestaurant().getId().equals(restaurant.getId()));

        if (differentRestaurant) {
            throw new BadRequestException("All cart items must be from the same restaurant");
        }

        double totalAmount = cart.getItems().stream()
                .mapToDouble(CartItem::getSubtotal)
                .sum();

        Order order = Order.builder()
                .user(user)
                .restaurant(restaurant)
                .totalAmount(totalAmount)
                .status(Order.OrderStatus.PENDING)
                .deliveryAddress(request.getDeliveryAddress())
                .items(new ArrayList<>())
                .build();

        // Convert cart items to order items
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> OrderItem.builder()
                .order(order)
                .menuItem(cartItem.getMenuItem())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getSubtotal())
                .build()
        ).collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Create payment record
        Payment payment = Payment.builder()
                .order(savedOrder)
                .amount(totalAmount)
                .method(Payment.PaymentMethod.valueOf(request.getPaymentMethod()))
                .status(request.getPaymentMethod().equals("COD")
                        ? Payment.PaymentStatus.PENDING
                        : Payment.PaymentStatus.SUCCESS)
                .transactionId("TXN" + System.currentTimeMillis())
                .build();
        paymentRepository.save(payment);

        // Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderResponse(savedOrder, payment);
    }

    public List<OrderResponse> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(order -> {
                    Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
                    return mapToOrderResponse(order, payment);
                })
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to this user");
        }

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        return mapToOrderResponse(order, payment);
    }

    @Transactional
    public OrderResponse cancelOrder(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to this user");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled at this stage");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (payment != null && payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        }

        return mapToOrderResponse(savedOrder, payment);
    }

    // Admin methods
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(order -> {
                    Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
                    return mapToOrderResponse(order, payment);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(Order.OrderStatus.valueOf(status));
        Order savedOrder = orderRepository.save(order);

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        return mapToOrderResponse(savedOrder, payment);
    }

    private OrderResponse mapToOrderResponse(Order order, Payment payment) {
        var itemResponses = order.getItems().stream().map(item ->
                OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemName(item.getMenuItem().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build()
        ).collect(Collectors.toList());

        OrderResponse.PaymentInfo paymentInfo = null;
        if (payment != null) {
            paymentInfo = OrderResponse.PaymentInfo.builder()
                    .method(payment.getMethod().name())
                    .status(payment.getStatus().name())
                    .amount(payment.getAmount())
                    .transactionId(payment.getTransactionId())
                    .build();
        }

        return OrderResponse.builder()
                .id(order.getId())
                .restaurantName(order.getRestaurant().getName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantImageUrl(order.getRestaurant().getImageUrl())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .deliveryAddress(order.getDeliveryAddress())
                .createdAt(order.getCreatedAt())
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .payment(paymentInfo)
                .build();
    }
}
