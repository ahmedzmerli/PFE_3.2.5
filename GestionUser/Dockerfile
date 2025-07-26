# Build stage
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copier uniquement les dependances pour optimiser les builds
COPY pom.xml .
RUN mvn dependency:go-offline

# Copier tout le projet et compiler le .war
COPY . .
RUN mvn clean package -DskipTests

# Run stage

FROM eclipse-temurin:17-jre
WORKDIR /app

# Copier le WAR genere
COPY --from=build /app/target/GestionUser-0.0.1-SNAPSHOT.war app.war

# Copier le script wait-for-it.sh
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Attendre MySQL avant de lancer Spring Boot
CMD ["./wait-for-it.sh", "mysql:3306", "--timeout=60", "--", "java", "-jar", "app.war"]