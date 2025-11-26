package com.authnlogix.backend.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 1. Enable a simple memory-based message broker
        config.enableSimpleBroker("/topic");

        // 2. Prefix for messages bound for methods annotated with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 3. Register the Endpoint that the Frontend will connect to
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // Allow React
                .withSockJS(); // Fallback option if WebSockets fail
    }

}
