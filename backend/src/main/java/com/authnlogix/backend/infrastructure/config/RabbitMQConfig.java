package com.authnlogix.backend.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration
 * Defines queues, exchange, bindings, and message converters for async
 * messaging
 */
@Configuration
public class RabbitMQConfig {

    // Queue Names
    public static final String QUEUE_EMAIL = "email_queue";
    public static final String QUEUE_LOW_STOCK = "low_stock_queue";

    // Exchange Name
    public static final String EXCHANGE = "authnlogix_exchange";

    // Routing Keys
    public static final String ROUTING_KEY = "email_routing_key";
    public static final String LOW_STOCK_ROUTING_KEY = "low_stock_routing_key";

    /**
     * Email Queue - for shipment notifications
     * Durable: Messages survive broker restart
     */
    @Bean
    public Queue emailQueue() {
        return QueueBuilder.durable(QUEUE_EMAIL).build();
    }

    /**
     * Low Stock Queue - for inventory alerts
     * Durable: Messages survive broker restart
     */
    @Bean
    public Queue lowStockQueue() {
        return QueueBuilder.durable(QUEUE_LOW_STOCK).build();
    }

    /**
     * Topic Exchange - routes messages based on routing keys
     * Durable: Exchange survives broker restart
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    /**
     * Binding: email_queue ← exchange (with email_routing_key)
     */
    @Bean
    public Binding emailBinding(Queue emailQueue, TopicExchange exchange) {
        return BindingBuilder.bind(emailQueue).to(exchange).with(ROUTING_KEY);
    }

    /**
     * Binding: low_stock_queue ← exchange (with low_stock_routing_key)
     */
    @Bean
    public Binding lowStockBinding(Queue lowStockQueue, TopicExchange exchange) {
        return BindingBuilder.bind(lowStockQueue).to(exchange).with(LOW_STOCK_ROUTING_KEY);
    }

    /**
     * JSON Message Converter
     * Converts Java objects to/from JSON for RabbitMQ messages
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * RabbitTemplate with JSON converter
     * Used to send messages to RabbitMQ
     */
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
