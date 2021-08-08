import { existsSync, mkdirSync, writeFileSync, copyFileSync, rmdirSync } from 'fs';
import { Socket } from 'socket.io';
import { Lang } from './models/lang';

export class FileManager {

    static build(socket: Socket, code: any, lang: string) {
        const { id } = socket;
        lang = lang.toLowerCase();
        try {
            if (!existsSync('/tmp/rce-sockets/')){
                mkdirSync("/tmp/rce-sockets/");
            }

            if (existsSync(`/tmp/rce-sockets/${id}`)) {
                rmdirSync(`/tmp/rce-sockets/${id}`, {recursive: true});
            }

            mkdirSync(`/tmp/rce-sockets/${id}`);
            writeFileSync(`/tmp/rce-sockets/${id}/Main${Lang[lang].extension}`, code);
            copyFileSync(__dirname + `/dockerfiles/${Lang[lang].folderName}/Dockerfile`, `/tmp/rce-sockets/${id}/Dockerfile`);
        } catch (err) {
            console.log(err);
        }
    }

    static remove(socket: Socket){
        const { id } = socket;
        try {
            rmdirSync(`/tmp/rce-sockets/${id}`, { recursive: true });
        } catch (err) {
            console.error(err);
        }
    }
    
}