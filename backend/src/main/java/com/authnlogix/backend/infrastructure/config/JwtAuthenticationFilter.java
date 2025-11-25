package com.authnlogix.backend.infrastructure.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // --- NEW SPY LOGS ---
        System.out.println("\n--- INCOMING REQUEST ---");
        System.out.println("URL: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod()); // IS THIS 'GET' OR 'OPTIONS'?

        System.out.println("Headers:");
        var headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String header = headerNames.nextElement();
            System.out.println("   " + header + ": " + request.getHeader(header));
        }

        // 1. Check if token exists
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ No Bearer Token found in header"); // <--- Log missing token
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract Token
        jwt = authHeader.substring(7); // Remove "Bearer "

        // 3. Extract Email from Token
        userEmail = jwtService.extractUsername(jwt);
        System.out.println("✅ Token Found for User: " + userEmail); // <--- Log success

        // 4. If user exists and is not already authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Validate Token
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 6. Update Security Context (Log the user in manually)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("⛔ Token Invalid!"); // <--- Log invalid
            }
        }

        // 7. Pass to next filter
        filterChain.doFilter(request, response);
    }

}
