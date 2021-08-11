import { DockerLangData } from './docker-lang-data';
import { Runtime } from '../models/runtime';

export const runtimes : Runtime[] = [
    {
        language: "java",
        dockerImage: DockerLangData["java"].imageTag,
        aliases: [ "java11" ]
    },
    {
        language: "python3",
        dockerImage: DockerLangData["python3"].imageTag,
        aliases: ['py3']
    },
    {
        language: "python2",
        dockerImage: DockerLangData["python2"].imageTag,
        aliases: ['py2']
    },
    {
        language: "javascript",
        dockerImage: DockerLangData["javascript"].imageTag,
        aliases: ['js', 'browserscript']
    },
    {
        language: "typescript",
        dockerImage: DockerLangData["typescript"].imageTag,
        aliases: ['ts', 'microsoft']
    },
    {
        language: "go",
        dockerImage: DockerLangData["go"].imageTag, 
        aliases: ['golang']
    }
];