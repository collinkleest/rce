export const DockerLangData : any = {
    python: {
        imageTag: "python:3-alpine",
        runCommands: (fileName: string, fileNameTitle?: string) =>  [`python3 /usr/src/${fileName}`],
        mountPath: "/usr/src",
    },
    python3: {
        imageTag: "python:3-alpine",
        runCommands: (fileName: string, fileNameTitle?: string) => [`python3 /usr/src/${fileName}`],
        mountPath: "/usr/src",
    },
    python2: {
        imageTag: "python:2-alpine",
        runCommands: (fileName: string, fileNameTitle?: string) => [`python /usr/src/${fileName}`],
        mountPath: "/usr/src"
    },
    java: {
        imageTag: "openjdk:11-jdk-slim",
        runCommands: (fileName: string, fileNameTitle: string) => {
            return [`javac /var/www/java/${fileName}`, `cd /var/www/java/`, `java ${fileNameTitle}`];
        },
        mountPath: "/var/www/java",
    },
    java11:{
        imageTag: "openjdk:11-jdk-slim",
        runCommands: (fileName: string, fileNameTitle: string) => {
            return [`javac /var/www/java/${fileName}`, `cd /var/www/java/`, `java ${fileNameTitle}`];
        },
        mountPath: "/var/www/java"
    },
    java8:{
        imageTag: "openjdk:8-jdk-alpine",
        runCommands: (fileName: string, fileNameTitle: string) => {
            return [`javac /var/www/java/${fileName}`, `cd /var/www/java/`, `java ${fileNameTitle}`];
        },
        mountPath: "/var/www/java",
    },
    javascript:{
        imageTag: "node:alpine",
        runCommands: (fileName: string, fileNameTitle?: string) => {
            return [`node /app/${fileName}`]
        },
        mountPath: "/app"
    },
    typescript: {
        imageTag: "node:alpine",
        runCommands: (fileName: string, fileNameTitle: string) => {
            return ["npm install -g typescript &>/dev/null", `tsc /app/${fileName}`, `node /app/${fileNameTitle}.js`]
        },
        mountPath: "/app",
    },
    go:{ 
        imageTag: "golang:alpine",
        runCommands: (fileName: string, fileNameTitle?: string) => [`go run /go/src/${fileName}`],
        mountPath: "/go/src"
    },
    c: {
        imageTag: "gcc:latest",
        runCommands: (fileName: string, fileNameTitle: string) => {
            return [
                `gcc /usr/src/${fileName} -o /usr/src/${fileNameTitle}`,
                `./usr/src/${fileNameTitle}`
            ]
        },
        mountPath: "/usr/src/"
    },
    'c++': {
        imageTag: "gcc:latest",
        runCommands: (fileName: string, fileNameTitle: string) => {
            return [
                `g++ /usr/src/${fileName} -o /usr/src/${fileNameTitle}`,
                `./usr/src/${fileNameTitle}`
            ]
        },
        mountPath: "/usr/src/"
    }
}