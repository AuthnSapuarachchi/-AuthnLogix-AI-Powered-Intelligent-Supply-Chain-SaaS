# --- Stage 1: Build the Application ---
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy configuration first to cache dependencies
COPY pom.xml .
# Download dependencies (offline mode)
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
# Build the JAR (Skip tests to speed up build)
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy only the built JAR from the 'builder' stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]