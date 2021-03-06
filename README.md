# RCE
Remote Code Executor WebApp and API to execute code in docker containers. 
Developed with [Socket.io](https://socket.io/), [React](https://reactjs.org/), [Dockerode](https://github.com/apocas/dockerode).

[Live Demo](http://ec2-100-25-133-108.compute-1.amazonaws.com/)

## Currently Suppored Languages
`java8`, `java11`, `python2`, `python3`, `typescript`, `javascript`, `golang`, `c`, `c++`

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

### Environment Variables
```
DOCKER_SOCK=<socket to docker daemon | default is /run/docker.sock>
DOCKER_TIMEOUT=<time in ms for dockerode to timeout | default is 5000>
SERVER_PORT=<port for server to run | default is 3000>
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
