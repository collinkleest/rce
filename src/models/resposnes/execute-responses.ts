export interface RemoteOutputResponse {
    language: string;
    output: {
        stdout: string;
        stderr: string;
    }
}