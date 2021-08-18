import Logger from 'js-logger';
import { Server } from 'socket.io';
import { RemoteJob } from '../core/RemoteJob';
import { RemoteJobParams } from '../models/remote-job';
import { DockerLangData } from '../data/docker-lang-data'; 
import { Submission } from '../models/submission';
const logger = Logger.get('SockerHelpers');


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
        logger.error(err);
        return;
    }

    const remoteOutput = await remoteJob.execute();
        
    await remoteJob.cleanup();

    ioServer.to(submission.roomId).emit('code-output', JSON.stringify({
        stdout: remoteOutput.stdout.toString(),
        stderr: remoteOutput.stderr.toString(),
    }));
}

const getFileNameFromLang = (lang: string) : string => {
    let fileName = '';
    if (lang === 'python' || lang === 'python3' || lang === 'python2'){
        fileName = 'Main.py';
    } else if (lang === 'javascript'){
        fileName = 'Main.js';
    } else if (lang === 'typescript') {
        fileName = 'Main.ts';
    } else if (lang === 'java' || lang === 'java8' || lang === 'java11'){
        fileName = 'Main.java';
    } else if (lang === 'go'){
        fileName = 'Main.go';
    } else if (lang === 'c'){
        fileName = 'Main.c';
    }
    return fileName;
}

export { codeSubmission };