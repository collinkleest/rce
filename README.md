# RCE
Remote Code Executor WebApp and API to execute code in docker containers. 
Developed with [Socket.io](https://socket.io/), [React](https://reactjs.org/), [Dockerode](https://github.com/apocas/dockerode).

## Currently Suppored Languages
`java8`, `java11`, `python2`, `python3`, `typescript`, `javascript`, `golang`

## Development

Install dependencies in both backend / frontend
```bash
yarn install

cd frontend/

yarn install
```

Run Development Servers
```bash
# open two seperate terminals
# in backend server
yarn run start:dev

# in the other terminal
cd frontend/

yarn run watch
```


## Endpoints
```bash
GET /api/v1/runtimes 
POST /api/v1/execute
```

### GET /api/v1/runtimes
```json
[
  {
    "language": "java",
    "dockerImage": "openjdk:11-jdk-slim",
    "aliases": [
      "java11"
    ]
  },
  {
    "language": "python3",
    "dockerImage": "python:3-alpine",
    "aliases": [
      "py3"
    ]
  }
]
```


### POST /api/v1/execute
Example request body
```json
// java example
{
    "language": "java",
    "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\");}}",
    "filename":"Main.java"
}

// python example
{
    "language":"python3",
    "code":"print('hello world')",
    "filename":"test.py"
}
```

Example response
```json
{
    "language": "java",
    "output": {
        "stdout": "Hello World\n",
        "stderr": ""
    }
}
```
Error Response
```json
{
    "message": "The image was unable to build",
    "error": "The command '/bin/sh -c javac Main.java' returned a non-zero code: 1",
    "imageStream": [
        {
            "stream":"[91mMain.java:1: error: ';' expected\npublic class Main { public static void main(String[] args) { System.out.println(\"Hello World\")}}\n                                                                                              ^\n[0m"
        },
        {
            "errorDetail": {
                "code": 1,
                "message": "The command '/bin/sh -c javac Main.java' returned a non-zero code: 1"
            },
            "error": "The command '/bin/sh -c javac Main.java' returned a non-zero code: 1"
        }
    ]
}
```
