# Build stage
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/GestionUser-0.0.1-SNAPSHOT.war app.war
ENTRYPOINT ["java", "-jar", "/app/app.war"]