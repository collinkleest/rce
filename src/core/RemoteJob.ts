import { v4 as uuidv4 } from 'uuid';
import Docker, { Container, DockerOptions, ContainerCreateOptions } from 'dockerode';
import Logger from 'js-logger';
import fs from 'fs';
import { JobState } from '../models/job-states';
import streams from 'memory-streams';
import { RemoteJobParams } from '../models/remote-job';


const logger = Logger.get('RemoteJob');
Logger.useDefaults();

const dockerConfig : DockerOptions = {
    socketPath: '/run/docker.sock',
    timeout: 5000,
}

const docker : Docker = new Docker(dockerConfig);

export class RemoteJob {
    uuid : string;
    language : string;
    code : string;
    filename : string;
    dir: string;
    state: JobState;
    image: string;
    runCommands: string[];
    mountPath: string;
    container : Container;

    constructor({language, code, filename, image, runCommands, mountPath} : RemoteJobParams) {
        this.uuid = uuidv4();
        this.code = code;
        this.language = language;
        this.filename = filename;
        this.dir = '/tmp/rce/';
        this.image = image;
        this.runCommands = runCommands;
        this.mountPath = mountPath;
        this.container = new Container(null, '');
        this.state = JobState.READY;
    }

    async setup() {
        if (this.state !== JobState.READY) {
            throw new Error('Job must be ready to setup');
        }
        
        logger.info(`Setting up job with uuid: ${this.uuid}`);
        
        if (!(fs.existsSync(this.dir))){
            await fs.promises.mkdir(this.dir);
        }

        await fs.promises.mkdir(this.dir + this.uuid, {recursive: true});
        
        await fs.promises.writeFile(`${this.dir}${this.uuid}/${this.filename}`, this.code);
        await fs.promises.chmod(`${this.dir}${this.uuid}/${this.filename}`, '755');

        await fs.promises.writeFile(`${this.dir}${this.uuid}/entrypoint.sh`, this.getEntrypointStr());
        await fs.promises.chmod(`${this.dir}${this.uuid}/entrypoint.sh`, '755');

        this.state = JobState.SETUP;
        logger.info(`Successfully set up job with uuid: ${this.uuid}`)
    }

    getEntrypointStr(): string{
        let entrypointContents = '#!/bin/bash\n';
        this.runCommands.forEach((cmd) => {
            entrypointContents += `${cmd}\n`;
        })
        return entrypointContents;
    }
    
    async execute(){
        if (this.state !== JobState.SETUP){
            throw new Error('Job has not been setup yet!');
        }
        
        this.state = JobState.EXECUTING;

        logger.info(`Executing job: ${this.uuid}`);
        
        
        const stdout = new streams.WritableStream();
        const stderr = new streams.WritableStream();
        const runData = await docker.run(
            this.image, 
            ['sh', `${this.mountPath}/entrypoint.sh`],
            [stdout, stderr], 
            {
                name: this.uuid,
                Tty: false,
                HostConfig: {
                    Binds: [`${this.dir}${this.uuid}/:${this.mountPath}`]
                },
            } as ContainerCreateOptions
        );
        this.container = runData[1];

        if (runData){
            this.state = JobState.EXECUTED;
        }

        logger.info(`Finished executing job: ${this.uuid}`);

        return {stdout: stdout, stderr: stderr};
    }

    async cleanup(){
        if (this.state !== JobState.EXECUTED) {
            throw new Error('Job cannot be cleaned up since it has not been executed');
        }

        if (this.container === null) {
            throw new Error('Container was never set!');
        }

        this.state = JobState.CLEANING;
        
        logger.info(`Cleanup has begun for job: ${this.uuid}`);

        await this.cleanupFiles();

        await this.cleanupContainer();
        
        this.state = JobState.CLEANED;
    }

    async cleanupFiles() {
        logger.info(`Cleaning up files for job ${this.uuid}`)

        this.state = JobState.CLEANING_FILES;

        if (!fs.existsSync(this.dir + this.uuid)) return;
        
        await fs.promises.rmdir(this.dir + this.uuid, { recursive: true });
    }


    async cleanupContainer(){
        if (this.container === null || this.container === undefined){
            throw new Error('No container present to clean up!');
        }

        this.state = JobState.CLEANING_CONTAINER;

        logger.info(`Cleaning up container: ${this.container.id}`);

        const containerInfo = await this.container.inspect();

        if (containerInfo.State.Running){
            await this.container.kill();
        }
        
        await this.container.remove();
    }


}