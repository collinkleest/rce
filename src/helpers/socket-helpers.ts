import Logger from 'js-logger';
import { Server } from 'socket.io';

import { RemoteJob } from '../core/RemoteJob';
import { RemoteJobParams } from '../models/remote-job';
import { DockerLangData } from '../data/docker-lang-data'; 
import { Submission } from '../models/submission';


const logger = Logger.get('SockerHelpers');
Logger.useDefaults();

const codeSubmission = async (submission : Submission, ioServer : Server) => {
    if (!submission.lang || typeof submission.lang !== 'string'){
        throw new Error('Submission must be a string and not null');
    }

    if (!submission.code || typeof submission.code !== 'string'){
        throw new Error('Code is a required string');
    }

    if (!submission.roomId || typeof submission.roomId !== 'string') {
        throw new Error('Room ID is a required string');
    }
    
    const fileName = getFileNameFromLang(submission.lang);
    const fileNameTitle = fileName.split('.').slice(0, -1).join('.');

    const remoteJobParams : RemoteJobParams = { 
        language: submission.lang,
        code: submission.code,
        filename: fileName,
        image: DockerLangData[submission.lang].imageTag,
        runCommands: DockerLangData[submission.lang].runCommands(fileName, fileNameTitle),
        mountPath: DockerLangData[submission.lang].mountPath
    }

    const remoteJob : RemoteJob = new RemoteJob(remoteJobParams);

    try {
        await remoteJob.setup();
    } catch (err){
        sendErrorToRoom(submission.roomId, ioServer, err);
        logger.error('Error in remote job setup:');
        logger.error(err);
        throw err;
    }

    try {
        const remoteOutput = await remoteJob.execute();
        ioServer.to(submission.roomId).emit('code-output', JSON.stringify({
            stdout: remoteOutput.stdout.toString(),
            stderr: remoteOutput.stderr.toString(),
        }));
    } catch (err) {
        sendErrorToRoom(submission.roomId, ioServer, err);
        logger.error('Error in remote job execution:');
        logger.error(err);
        throw err;
    }
    
    try {
        await remoteJob.cleanup();
    } catch (err) {
        sendErrorToRoom(submission.roomId, ioServer, err);
        logger.error('Error in remote job cleanup:');
        logger.error(err);
        throw err;
    }
    
}

const sendErrorToRoom = (roomId: string, ioServer: Server, err: Error) => {
    ioServer.to(roomId).emit('code-output', JSON.stringify({
        stdout: '',
        stderr: err,
    }));    
}

const getFileNameFromLang = (lang: string) : string => {
    let fileName = '';
    switch (lang) {
        case 'python': case 'python3': case 'python2':
            fileName = 'Main.py';
            break;
        case 'javascript':
            fileName = 'Main.js';
            break;
        case 'typescript':
            fileName = 'Main.ts';
            break;
        case 'java': case 'java8': case 'java11':
            fileName = 'Main.java';
            break;
        case 'go':
            fileName = 'Main.go';
            break;
        case 'c':
            fileName = 'Main.c';
            break;
        case 'c++':
            fileName = 'Main.cpp';
            break;
    }
    return fileName;
}


export { codeSubmission, getFileNameFromLang, sendErrorToRoom };