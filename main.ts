import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { FileManager } from './src/FileManager';
import { DockerManager } from './src/DockerManager';
import { Submission } from './src/models/submission';
import { apiRouter } from './src/routes';

const app  = express();
const server = http.createServer(app);
const ioServer : Server = new Server(server);

app.use('/', express.static(__dirname + '/frontend/build/'));

ioServer.on('connection', (socket: Socket) => {
    console.log(`${socket.id} has connected`);

    socket.join(socket.id);

    socket.on('new-code', (text: string , room: string) => {
        ioServer.to(room).emit('new-code-remote', text);
    })

    socket.on('join-room', (roomId : string) => {
        socket.join(roomId);
    })

    socket.on('disconnect', () => {
        console.log(` ${socket.id} has disconnected`);
        FileManager.remove(socket);
    })
    
    socket.on('code-submission', (submission: string) => {
        const parsedSubmission : Submission = JSON.parse(submission);
        FileManager.build(socket, parsedSubmission.code, parsedSubmission.lang);
        DockerManager.build(socket, parsedSubmission.lang, parsedSubmission.roomId, ioServer);
    })

});

app.use('/api', apiRouter);

server.listen(3000, () => {
    console.log('listening on *.*.*.*:3000');
});

