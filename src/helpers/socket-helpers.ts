import Logger from 'js-logger';
import { Server } from 'socket.io';
import { RemoteJob } from '../core/RemoteJob';
import { RemoteJobParams } from '../models/remote-job';
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

    const remoteJobParams : RemoteJobParams = {
        language: submission.lang,
        code: submission.code,
        filename: fileName
    }

    const remoteJob : RemoteJob = new RemoteJob(remoteJobParams);

    await remoteJob.setup();

    let buildImgData : any = await remoteJob.buildImage(ioServer, submission.roomId);
    if (buildImgData) {
        const errorFound = buildImgData.find((val: any) => val.hasOwnProperty("error") || val.hasOwnProperty("errorDetail"));
        const auxObjectFound = buildImgData.find((val : any) => val.hasOwnProperty("aux"))
        if (auxObjectFound && !errorFound) {
            remoteJob.imageId = auxObjectFound['aux']['ID'];
        } else {
            logger.error(`Build image was unsuccessful`);
            await remoteJob.cleanupFiles();
            ioServer.to(submission.roomId).emit('code-output', errorFound.error);
            throw new Error('Image build was unsuccessful');
        }
        remoteJob.imageId = auxObjectFound['aux']['ID'];
    }

    const remoteOutput = await remoteJob.execute();
        
    await remoteJob.cleanup();

    ioServer.to(submission.roomId).emit('code-output', remoteOutput.stdout.toString());
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
    }
    return fileName;
}

export { codeSubmission };