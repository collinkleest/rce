export interface ImageBuildFailureResponse {
    message: string;
    error: string;
    imageStream: object[];
}

export interface RemoteOutputResponse {
    language: string;
    output: {
        stdout: string;
        stderr: string;
    }
}