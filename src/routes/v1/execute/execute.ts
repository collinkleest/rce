import express from 'express';
import { RemoteJob } from '../../../core/RemoteJob';
import { RemoteJobParams } from '../../../models/remote-job';
import Logger from 'js-logger';
import { ImageBuildFailureResponse, RemoteOutputResponse } from '../../../models/resposnes/execute-responses'; 
import { ExecuteRequestBody } from '../../../models/requests/execute-request';

const logger = Logger.get('ExecuteRoute');
const executeRoutes = express.Router();

executeRoutes.post('/', async (req, res) => {
    logger.info(`Request received with body of ${req.body} from ${req.ip}`);
    const { 
        language,
        filename,
        code
    } = req.body as ExecuteRequestBody;

    if (!language || typeof language !== 'string'){
        return res.status(400).send({
            message: 'language is required as a string'
        })
    }

    if (!code || typeof code !== 'string'){
        return res.status(400).send({
            message: 'code is required as a string'
        })
    }

    if (!filename || typeof filename !== 'string'){
        return res.status(400).send({
            message: 'filename is required as a string'
        })
    }

    const remoteJobParams : RemoteJobParams = {
        language: language.trim(),
        code: code,
        filename: filename
    }

    const remoteJob : RemoteJob = new RemoteJob(remoteJobParams)

    await remoteJob.setup();

    const buildImgData : any = await remoteJob.buildImage();
    if (buildImgData) {
        const errorFound = buildImgData.find((val: any) => val.hasOwnProperty("error") || val.hasOwnProperty("errorDetail"));
        const auxObjectFound = buildImgData.find((val : any) => val.hasOwnProperty("aux"))
        if (auxObjectFound && !errorFound) {
            remoteJob.imageId = auxObjectFound['aux']['ID'];
        } else {
            logger.error(`Build image was unsuccessful`);
            await remoteJob.cleanupFiles();
            res.status(500).send({
                message: 'The image was unable to build',
                error: errorFound.error,
                imageStream: buildImgData,
            } as ImageBuildFailureResponse)
            throw new Error('Image build was unsuccessful');
        }
    }

    const remoteOutput = await remoteJob.execute();

    await remoteJob.cleanup();
    
    const output : RemoteOutputResponse = {
        language: language,
        output: {
            stdout: remoteOutput.stdout.toString(),
            stderr: remoteOutput.stderr.toString()
        }
    }

    res.status(200).send(output as RemoteOutputResponse);
})


export { executeRoutes };