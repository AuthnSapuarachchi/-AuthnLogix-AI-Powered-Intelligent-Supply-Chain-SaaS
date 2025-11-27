package com.authnlogix.backend.application.service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.secret}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public Map<String, String> createPaymentIntent(Double amount) {
        // Stripe expects amount in CENTS (e.g. $10.00 = 1000 cents)
        long amountInCents = (long) (amount * 100);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);

            // Return the Client Secret (The Frontend needs this to complete the payment)
            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());
            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error creating payment intent", e);
        }
    }

}
