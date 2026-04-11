package com.foodapp.service;

import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.Order;
import com.foodapp.model.Payment;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Payment initiatePayment(Long orderId, String method) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Check if payment already exists
        Payment existingPayment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (existingPayment != null) {
            return existingPayment;
        }

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(Payment.PaymentMethod.valueOf(method))
                .status(Payment.PaymentStatus.SUCCESS)
                .transactionId("TXN" + System.currentTimeMillis())
                .build();

        return paymentRepository.save(payment);
    }
}
