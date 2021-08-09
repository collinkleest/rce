import fs from 'fs';
import { Images } from '../models/images';


export class DFileGenerator {
    language : string;
    filename : string;

    constructor(language : string, filename: string){
        this.language = language;
        this.filename = filename;
    }

    generate() : string {
        let dockerFileContent = "";
        if (this.language === 'python' || this.language === 'python3' || this.language === 'python2'){
            if (this.language === 'python2'){
                dockerFileContent += `FROM ${Images.PYTHON2}\n`;
            } else {
                dockerFileContent += `FROM ${Images.PYTHON}\n`;
            }
            dockerFileContent += "WORKDIR /usr/src/app\n";
            dockerFileContent += "COPY . .\n";
            dockerFileContent += `CMD [ "${this.filename}" ]\n`;
            if (this.language === 'python2') {
                dockerFileContent += 'ENTRYPOINT ["python"]'
            } else {
                dockerFileContent += 'ENTRYPOINT ["python3"]'
            }
        } else if (this.language === 'javascript' || this.language === 'typescript'){
            dockerFileContent += `FROM ${Images.JAVASCRIPT}\n`;
            dockerFileContent += `WORKDIR /app\n`;
            dockerFileContent += 'COPY . .\n'
            if (this.language === 'typescript'){
                dockerFileContent += 'RUN npm install typescript -g\n';
                dockerFileContent += `RUN tsc ${this.filename}\n`
            }
            dockerFileContent += `CMD [ "node", "${this.filename}" ]`
        }
        return dockerFileContent;
    }

}