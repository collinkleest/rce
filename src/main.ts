#!/usr/bin/env node
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import Logger from 'js-logger';
import path from 'path';


import { Submission } from './models/submission';
import { apiRouter } from './routes';
import { codeSubmission } from './helpers/socket-helpers';
import { prePullImages } from './helpers/setup';

const logger = Logger.get('Main');
Logger.useDefaults();

const app  = express();
const server = http.createServer(app);
const ioServer : Server = new Server(server);


app.use('/', express.static(path.join(__dirname + '/../frontend/build/')));
app.use(express.json());

ioServer.on('connection', (socket: Socket) => {
    logger.info(`${socket.id} has connected`);

    socket.join(socket.id);

    socket.on('new-code', (text: string , room: string) => {
        ioServer.to(room).emit('new-code-remote', text);
    })

    socket.on('join-room', (roomId : string) => {
        socket.join(roomId);
    })

    socket.on('disconnect', () => {
        logger.info(`${socket.id} has disconnected`);
    })
    
    socket.on('code-submission', (submission: string) => {
        const parsedSubmission : Submission = JSON.parse(submission);
        codeSubmission(parsedSubmission, ioServer);
    })

});

app.use('/api', apiRouter);

const SERVER_PORT = process.env.SERVER_PORT || 3000; 

server.listen(SERVER_PORT, () => {
    logger.info(`Server is Listening at *.*.*.*:${SERVER_PORT}`)
});

try {
    prePullImages();
} catch(err) {
    logger.error(`Unable to pull images: ${err}`)
}