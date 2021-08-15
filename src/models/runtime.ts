export interface Runtime {
    language: string;
    dockerImage: string;
    aliases?: string[];
}