import Docker, { DockerOptions } from 'dockerode';
import Logger from 'js-logger';

import { DockerLangData } from '../data/docker-lang-data';

const logger = Logger.get('SetupHelper');
Logger.useDefaults();

const dockerConfig : DockerOptions = {
    socketPath: '/run/docker.sock',
    timeout: 5000,
}

const docker : Docker = new Docker(dockerConfig);

export async function prePullImages() {
    logger.info('Pre pulling images');
    
    const pulled : Set<string> = new Set();
    
    for (const img of Object.values(DockerLangData) as any) {
        if (!pulled.has(img.imageTag)){
            pulled.add(img.imageTag);
            logger.info(`Pulling docker image: ${img.imageTag}`);
            await docker.pull(img.imageTag);
        } 
    }

}