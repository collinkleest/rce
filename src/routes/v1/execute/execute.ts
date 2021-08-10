import express from 'express';
import { RemoteJob } from '../../../core/RemoteJob';
import { RemoteJobParams } from '../../../models/remote-job';

const executeRoutes = express.Router();

executeRoutes.post('/', async (req, res) => {
    const { 
        language,
        filename,
        code
    } = req.body;

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

    let buildImgData : any = await remoteJob.buildImage();
    if (buildImgData) {
        let found = buildImgData.find((val : any) => val.hasOwnProperty("aux"))
        remoteJob.imageId = found['aux']['ID'];
    }

    const remoteOutput = await remoteJob.execute();

    await remoteJob.cleanup();
    
    const output = {
        language: language,
        output: {
            stdout: remoteOutput.stdout.toString(),
            stderr: remoteOutput.stderr.toString()
        }
    }

    res.send(output);
})


export { executeRoutes };