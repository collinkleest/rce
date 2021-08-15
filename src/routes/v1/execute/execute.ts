import express from 'express';
import { RemoteJob } from '../../../core/RemoteJob';
import { RemoteJobParams } from '../../../models/remote-job';
import Logger from 'js-logger';
import { RemoteOutputResponse } from '../../../models/resposnes/execute-responses';
import { DockerLangData } from '../../../data/docker-lang-data'; 
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

    if (DockerLangData[language] === undefined){
        return res.status(400).send({
            message: `${language} is not a supported language`
        })
    }

    const fileNameTitle = filename.split('.').slice(0, -1).join('.');

    const remoteJobParams : RemoteJobParams = {
        language: language.trim(),
        code: code,
        filename: filename,
        image: DockerLangData[language].imageTag,
        runCommands: DockerLangData[language].runCommands(filename, fileNameTitle),
        mountPath: DockerLangData[language].mountPath,
    }

    const remoteJob : RemoteJob = new RemoteJob(remoteJobParams)

    await remoteJob.setup();

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