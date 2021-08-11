import { Image } from '../models/image';
import { Runtime } from '../models/runtime';

export const runtimes : Runtime[] = [
    {
        language: "java",
        dockerImage: Image.JAVA,
        aliases: [ "java11" ]
    },
    {
        language: "python3",
        dockerImage: Image.PYTHON3,
        aliases: ['py3']
    },
    {
        language: "python2",
        dockerImage: Image.PYTHON2,
        aliases: ['py2']
    },
    {
        language: "javascript",
        dockerImage: Image.JAVASCRIPT,
        aliases: ['js', 'browserscript']
    },
    {
        language: "typescript",
        dockerImage: Image.TYPESCRIPT,
        aliases: ['ts', 'microsoft']
    },
    {
        language: "go",
        dockerImage: Image.GO, 
        aliases: ['golang']
    }
];