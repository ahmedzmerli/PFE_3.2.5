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

COPY --from=build /app/target/GestionUser-0.0.1-SNAPSHOT.war app.war

# Attendre que MySQL soit pret avant de lancer l'application
CMD ["sh", "-c", "echo 'Attente de MySQL pendant 60 secondes...' && sleep 60 && java -jar app.war"]
