package com.authnlogix.backend.infrastructure.adapter.input;

import com.authnlogix.backend.application.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody Map<String, Double> request) {
        Double amount = request.get("amount");
        return ResponseEntity.ok(paymentService.createPaymentIntent(amount));
    }
}
