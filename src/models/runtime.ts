import { Image } from "./image";

export interface Runtime {
    language: string;
    dockerImage: Image;
    aliases?: string[];
}