package com.foodapp.controller;

import com.foodapp.dto.ApiResponse;
import com.foodapp.dto.PaymentRequest;
import com.foodapp.model.Payment;
import com.foodapp.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<Payment>> initiatePayment(@Valid @RequestBody PaymentRequest request) {
        Payment payment = paymentService.initiatePayment(request.getOrderId(), request.getMethod());
        return ResponseEntity.ok(ApiResponse.success(payment, "Payment initiated"));
    }
}
