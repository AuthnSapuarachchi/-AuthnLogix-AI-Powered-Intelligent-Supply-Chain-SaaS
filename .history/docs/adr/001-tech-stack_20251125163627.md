# ADR-001: Technology Stack Selection

## Status

Accepted

## Context

We are building AuthnLogix, a high-scale supply chain platform. We need strict type safety, high concurrency, and real-time capabilities.

## Decision

We will use the following stack:

1. **Backend:** Java 17 + Spring Boot 3.
   _Reason:_ Java offers superior stability and the Spring ecosystem (Security, Data) accelerates development.
2. **Frontend:** React + TypeScript.
   _Reason:_ TypeScript prevents runtime errors common in large logistics data dashboards.
3. **Database:** PostgreSQL.
   _Reason:_ Relational data integrity is required for inventory and orders.
4. **Infrastructure:** Docker.
   _Reason:_ Ensures "It works on my machine" applies to production too.

## Consequences

- Initial setup time is higher than a simple Node.js app.
- Strict typing requires more code upfront but reduces bugs long-term.
