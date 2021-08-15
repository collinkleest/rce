import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import Logger from 'js-logger';

import { Submission } from './src/models/submission';
import { apiRouter } from './src/routes';
import { codeSubmission } from './src/helpers/socket-helpers';
import { prePullImages } from './src/helpers/setup';

const logger = Logger.get('Main');
Logger.useDefaults();

const app  = express();
const server = http.createServer(app);
const ioServer : Server = new Server(server);

app.use('/', express.static(__dirname + '/frontend/build/'));
app.use(express.json());

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
    })
    
    socket.on('code-submission', (submission: string) => {
        const parsedSubmission : Submission = JSON.parse(submission);
        codeSubmission(parsedSubmission, ioServer);
    })

});

app.use('/api', apiRouter);

server.listen(3000, () => {
    console.log('listening on *.*.*.*:3000');
});

try {
    prePullImages();
} catch(err) {
    logger.error(`Unable to pull images: ${err}`)
}