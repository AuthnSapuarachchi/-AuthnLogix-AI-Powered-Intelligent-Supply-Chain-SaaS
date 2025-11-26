 # 🚛 AuthnLogix - AI-Powered-Intelligent-Supply-Chain-SaaS

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

**AuthnLogix** is a production-ready, full-stack inventory management platform designed for real-time supply chain tracking. 

It features a **Hexagonal Architecture** backend and a **Feature-Sliced Design (FSD)** frontend, ensuring scalability and maintainability. The system is fully containerized using multi-stage Docker builds and served via an Nginx reverse proxy.

---

## ⚡ Key Features

* **🔐 Stateless Security:** Enterprise-grade Authentication using **JWT** (JSON Web Tokens) and **BCrypt** password hashing.
* **📡 Real-Time Events:** WebSocket (STOMP) integration updates inventory dashboards instantly across all connected clients without polling.
* **🏭 Multi-Warehouse Logic:** Intelligent capacity validation prevents overstocking; manages relationships between warehouses and products.
* **🛡️ Role-Based Access:** Secure API endpoints protected by Spring Security filter chains.
* **🐳 Production DevOps:** Fully Dockerized environment with **Nginx Reverse Proxy** handling CORS and static assets.

---

## 🏗️ Architecture

The system is built using **Clean Architecture** principles to decouple business logic from frameworks.

### Backend (Spring Boot 3)
We utilize **Hexagonal Architecture (Ports & Adapters)**:
* **Domain Layer:** Pure Java entities (`User`, `Warehouse`, `Product`) with zero framework dependencies.
* **Application Layer:** Service logic and DTOs handling use-cases and validation.
* **Infrastructure Layer:** Adapters for PostgreSQL, REST Controllers, and Security Configurations.

### Frontend (React + TypeScript)
We utilize **Feature-Sliced Design (FSD)**:
* **Layers:** `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
* **Tech:** Vite, Tailwind CSS v3, Zustand (State), TanStack Query (Data Fetching).

### Infrastructure (Docker)
The production build uses a custom network mesh:
```mermaid
graph LR
    Client[Browser] -- Port 80 --> Nginx[Nginx Gateway]
    Nginx -- /api --> Backend[Spring Boot API]
    Nginx -- /ws --> Backend
    Nginx -- Static --> React[React Files]
    Backend -- Port 5432 --> DB[(PostgreSQL)]
    Backend -- Port 6379 --> Redis[(Redis Cache)]
```
---

## Category and Technologies

| Category | Technologies                                      |
|----------|-------------------------------------------------|
| Backend  | Java 17, Spring Boot 3, Spring Security, Hibernate (JPA), WebSocket |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Query, React Hook Form |
| Database | PostgreSQL 15, Redis 7 (Caching)                 |
| DevOps   | Docker Compose, Nginx (Alpine), Multi-stage Builds |


---
## 🚀 Getting Started

### Prerequisites

- Docker Desktop installed and running.
- Git.

### Option 1: Run in Production Mode (Recommended)

This simulates a real AWS/Cloud deployment using Nginx.

1. Clone the repository:
   git clone [https://github.com/YOUR_USERNAME/authnlogix-saas.git](https://github.com/YOUR_USERNAME/authnlogix-saas.git)
cd authnlogix-saas

2. Build and start containers:
   docker-compose -f docker-compose.prod.yml up --build -d


3. Access the app:

Open your browser and go to [http://localhost](http://localhost) (Runs on Port 80)

**Admin Login:**
- Email: alice.secure@example.com
- Password: mySecretPassword

---

### Option 2: Run in Development Mode

If you want to edit code with hot-reloading.

1. Start Infrastructure (DB & Redis):
    docker-compose up -d


2. Start Backend:
- Open backend in IntelliJ IDEA/Eclipse.
- Run `BackendApplication.java`.

3. Start Frontend:

cd frontend
npm install
npm run dev


Access the frontend at [http://localhost:5173](http://localhost:5173)







