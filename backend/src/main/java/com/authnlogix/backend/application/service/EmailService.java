package com.authnlogix.backend.application.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    // @Async means "Don't wait for this to finish".
    // The user gets their response immediately, and email sends in background.
    @Async
    public void sendShipmentNotification(String to, String productName, Integer quantity, String destination) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@authnlogix.com");
            helper.setTo(to);
            helper.setSubject("📦 New Shipment Alert: " + productName);

            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #0056b3;">New Shipment Created</h2>
                    <p>A new outbound order has been processed.</p>
                    <hr/>
                    <ul>
                        <li><strong>Product:</strong> %s</li>
                        <li><strong>Quantity:</strong> %d</li>
                        <li><strong>Destination:</strong> %s</li>
                    </ul>
                    <p>Please login to the dashboard to view details.</p>
                </div>
            """, productName, quantity, destination);

            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
            System.out.println("📧 Email sent to " + to);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Async
    public void sendLowStockAlert(String to, String productName, Integer currentStock) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("noreply@authnlogix.com");
        helper.setTo(to);

        helper.setSubject("⚠️ Low Stock Warning: " + productName);

        String htmlContent = String.format("""
            <h2 style="color: #d9534f;">Low Inventory Alert</h2>
            <p>The stock for <strong>%s</strong> has dropped below the safety threshold.</p>
            <h3>Current Quantity: %d</h3>
            <p>Please contact suppliers immediately.</p>
        """, productName, currentStock);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@authnlogix.com");
            helper.setTo(to);
            helper.setSubject("🔒 Reset Your Password");

            String resetUrl = "http://localhost:5173/reset-password?token=" + token;

            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="color: #0056b3;">Password Reset Request</h2>
                    <p>We received a request to reset your password.</p>
                    <p>Click the button below to reset it. This link expires in 15 minutes.</p>
                    <br/>
                    <a href="%s" style="background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <br/><br/>
                    <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
                </div>
            """, resetUrl);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("📧 Password Reset email sent to " + to);

        } catch (MessagingException e) {
            System.err.println("Failed to send reset email: " + e.getMessage());
        }
    }

}
