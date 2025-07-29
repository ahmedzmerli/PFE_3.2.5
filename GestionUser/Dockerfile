# Build stage
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml . 
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

RUN apt-get update && apt-get install -y mysql-client netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/GestionUser-0.0.1-SNAPSHOT.jar app.jar
COPY wait-for-jdbc.sh .
RUN chmod +x wait-for-jdbc.sh

CMD sh -c "./wait-for-jdbc.sh && java -jar app.jar"

