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

# Installer netcat (version correcte)
RUN apt-get update && apt-get install -y netcat-openbsd

COPY --from=build /app/target/GestionUser-0.0.1-SNAPSHOT.war app.war
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Attendre que MySQL soit prêt avant de lancer l'app
CMD ["./wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "app.war"]
