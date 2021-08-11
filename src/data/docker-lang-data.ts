interface DockerData {
    imageTag: string;
    cmd: string;
    mountPoint?: string;
}

export const DockerLangData : any = {
    python: { 
        imageTag: "python:3-alpine",
        cmd: "python3",
        mountPath: "/usr/src"
    },
    python3: {
        imageTag: "python:3-alpine",
        cmd: "python3",
        mountPath: "/usr/src",
    },
    python2: {
        imageTag: "python:2-alpine",
        cmd: "python",
        mountPath: "/usr/src"
    },
    java: {
        imageTag: "openjdk:11-jdk-slim",
        cmd: "java",
        mountPath: "/var/www/java"
    },
    java11:{
        imageTag: "openjdk:11-jdk-slim",
        cmd: "java",
        mountPath: "/var/www/java"
    },
    java8:{
        imageTag: "openjdk:8-jdk-alpine",
        cmd: "java",
        mountPath: "/var/www/java"
    },
    javascript:{
        imageTag: "node:alpine",
        cmd: "node",
        mountPath: "/app"
    },
    typescript: {
        imageTag: "node:alpine",
        cmd: "node",
        mountPath: "/app"
    },
    go:{ 
        imageTag: "golang:alpine",
        cmd: "go"
    }
}