import { v4 as uuidv4 } from 'uuid';
import Docker, { Container, DockerOptions } from 'dockerode';
import Logger from 'js-logger';
import fs from 'fs';
import { RemoteJobParams } from '../models/remote-job';
import { JobState } from '../models/job-states';
import { DFileGenerator } from './DFileGenerator';
import streams from 'memory-streams';


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
    imageId: string;
    container : Container;

    constructor(remoteJobParams: RemoteJobParams) {
        this.uuid = uuidv4();
        this.code = remoteJobParams.code;
        this.language = remoteJobParams.language;
        this.filename = remoteJobParams.filename;
        this.dir = '/tmp/rce/';
        this.imageId = '';
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

        const dockerFileContent  = new DFileGenerator(this.language, this.filename).generate();

        await fs.promises.writeFile(`${this.dir}${this.uuid}/Dockerfile`, dockerFileContent);

        this.state = JobState.SETUP;
        logger.info(`Successfully set up job with uuid: ${this.uuid}`)
    }

    async buildImage() {
        if (this.state !== JobState.SETUP){
            throw new Error('Job should be setup before building an image');
        }
        
        let imageStream = await docker.buildImage({
                context: `${this.dir}${this.uuid}`, 
                src: ['Dockerfile', this.filename]
        });

        this.state = JobState.BUILT;
        return await new Promise((resolve, reject) => {
            docker.modem.followProgress(imageStream, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }

    async execute(){
        logger.info(`Executing job ${this.uuid}`);
        
        if (this.state !== JobState.BUILT){
            throw new Error('Job has not been built yet!');
        }

        const stdout = new streams.WritableStream();
        const stderr = new streams.WritableStream();
        let runData = await docker.run(this.imageId, [], [stdout, stderr], {Tty: false});
        this.container = runData[1];

        this.state = JobState.EXECUTED;

        logger.info(`Finished executing job ${this.uuid}`);

        return {stdout: stdout, stderr: stderr};
    }

    async cleanup(){
        if (this.state !== JobState.EXECUTED) {
            throw new Error('Job cannot be cleaned up since it has not been executed');
        }

        if (this.container === null) {
            throw new Error('Container was never set!');
        }
        

        await this.cleanupFiles();

        await this.cleanupContainer().then(() => {
            this.cleanupImage();
        });
        
        this.state = JobState.CLEANED;
    }

    async cleanupFiles() {
        logger.info(`Cleaning up files for job ${this.uuid}`)

        if (!fs.existsSync(this.dir + this.uuid)) return;
        
        await fs.promises.rmdir(this.dir + this.uuid, { recursive: true });
    }

    async cleanupImage(){
        if (this.imageId === '' || this.imageId === null || this.imageId === undefined){
            throw new Error("Cannot clean up image when there is no image id set");
        }
        
        logger.info(`Cleaning image: ${this.imageId} for job ${this.uuid}`);

        const image = await docker.getImage(this.imageId);
        
        await image.remove();
    }

    async cleanupContainer(){
        if (this.container === null || this.container === undefined){
            throw new Error('No container present to clean up!');
        }

        logger.info(`Cleaning up container: ${this.container.id}`);

        const containerInfo = await this.container.inspect();

        if (containerInfo.State.Running){
            await this.container.kill();
        }
        
        await this.container.remove();
    }


}