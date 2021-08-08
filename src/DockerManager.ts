import Docker, { Container, DockerOptions } from 'dockerode';
import { Server, Socket } from 'socket.io';
import streams from 'memory-streams';
import { Lang } from './models/lang';

const dockerConfig : DockerOptions = {
    socketPath: '/run/docker.sock',
} 

const docker : Docker = new Docker(dockerConfig);

export class DockerManager {
    static build(socket: Socket, lang: string, roomId: string, ioServer: Server){
        const { id } = socket;
        lang = lang.toLowerCase();
        docker.buildImage({context: `/tmp/rce-sockets/${id}/`, src: ['Dockerfile', `Main${Lang[lang].extension}`]})
        .then((stream: NodeJS.ReadableStream) => {
            docker.modem.followProgress(
                stream, 
                (err, res) => {
                    let foundError =  res.find((val) => val.hasOwnProperty('error'));
                    if (res && !foundError) {
                        let foundVal = res.filter((val: Object) => {
                            return val.hasOwnProperty('aux')
                        })
                        let imgId = foundVal[0]['aux']['ID'];
                        this.run(socket, imgId, roomId, ioServer);
                    } else {
                        console.error(foundError);
                        console.error(err);
                    }
                },
                (progress) => {
                    ioServer.to(roomId).emit('progress', progress.stream);
                })
        })
    }

    static run(socket: Socket, imageId: string, roomId: string, ioServer: Server){
        const stdout = new streams.WritableStream();
        docker.run(imageId, [], stdout).then((data) => {
            const container : Container = data[1];
            ioServer.to(roomId).emit('code-output', stdout.toString());
            container.remove();
        }).catch((err) => {
            console.error(err);
        })
    }
}