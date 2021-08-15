export interface RemoteJobParams {
    language: string;
    code: string;
    filename: string;
    image: string;
    runCommands: string[];
    mountPath: string;
}