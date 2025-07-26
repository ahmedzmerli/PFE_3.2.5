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

# Install netcat
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*

# Add dockerize
ADD https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz .
RUN tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz && rm dockerize-linux-amd64-v0.6.1.tar.gz

# Copy .war
COPY --from=build /app/target/GestionUser-0.0.1-SNAPSHOT.war app.war

# Start app after waiting for MySQL with debugging
CMD ["sh", "-c", "ping -c 3 mysql && dockerize -wait tcp://mysql:3306 -timeout 120s java -jar app.war"]