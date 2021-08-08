FROM openjdk:11-jdk-slim
COPY . /var/www/java
WORKDIR /var/www/java
RUN javac Main.java
CMD ["java", "Main"]