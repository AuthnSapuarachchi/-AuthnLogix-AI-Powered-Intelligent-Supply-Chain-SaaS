# ADR-002: Stateless Authentication via JWT

## Status

Accepted

## Context

We need to secure the AuthnLogix platform.

- The frontend is a Single Page Application (React).
- The backend is a stateless REST API (Spring Boot).
- We require horizontal scalability (adding more servers easily).

## Decision

We chose **JSON Web Tokens (JWT)** over Server-Side Sessions.

1. **Stateless:** The server does not store active sessions in RAM or DB.
2. **Security:** Passwords are hashed using **BCrypt**.
3. **Transport:** Tokens are sent via `Authorization: Bearer` header.
4. **Implementation:** - `JwtAuthenticationFilter` intercepts requests.
   - `UserDetailsService` loads user data from PostgreSQL.

## Consequences

- **Pros:** The backend can be scaled infinitely without sharing session state.
- **Cons:** Revoking a specific token before expiry is difficult (requires a deny-list).
- **Mitigation:** We set short expiration times (24 hours).
