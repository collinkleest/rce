import Docker, { DockerOptions } from 'dockerode';
import Logger from 'js-logger';

import { Image } from '../models/image';

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
    
    for (const img of Object.values(Image)) {
        if (!pulled.has(img)){
            pulled.add(img);
            logger.info(`Pulling docker image: ${img}`);
            await docker.pull(img);
        } 
    }

}