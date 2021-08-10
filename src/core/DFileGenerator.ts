import fs from 'fs';
import path from 'path';
import { Images } from '../models/images';
import ejs from 'ejs';

export class DFileGenerator {
    language : string;
    filename : string;
    fileNameTitle : string;

    constructor(language : string, filename: string){
        this.language = language;
        this.filename = filename;
        this.fileNameTitle = filename.split('.').slice(0, -1).join('.');
    }

    generate() : string {
        let dockerFileContent = "";
        let ejsTemplate;

        if (this.language === 'python' || this.language === 'python3' || this.language === 'python2'){
            dockerFileContent = this.generatePython();
        }
        else if (this.language === 'javascript'){
            ejsTemplate = fs.readFileSync(path.join(__dirname + '/../dockerfile-templates/javascript-docker-template.ejs')).toString();
            dockerFileContent = ejs.render(ejsTemplate, {
                imageTag: Images.JAVASCRIPT,
                fileName: this.filename
            })
        } else if (this.language === 'typescript') {
            ejsTemplate = fs.readFileSync(path.join(__dirname + '/../dockerfile-templates/typescript-docker-template.ejs')).toString();
            dockerFileContent = ejs.render(ejsTemplate, {
                imageTag: Images.TYPESCRIPT,
                fileNameTitle: this.fileNameTitle
            })
        }else if (this.language === 'java' || this.language || 'java11'){
            ejsTemplate = fs.readFileSync(path.join(__dirname + '/../dockerfile-templates/java-docker-template.ejs')).toString();
            if (this.language === 'java8'){
                dockerFileContent = ejs.render(ejsTemplate, {
                    imageTag: Images.JAVA8,
                    fileName: this.filename,
                    fileNameTitle: this.fileNameTitle,
                }) 
            } else {
                dockerFileContent = ejs.render(ejsTemplate, {
                    imageTag: Images.JAVA11,
                    fileName: this.filename,
                    fileNameTitle: this.fileNameTitle,
                })
            }
        } 
        return dockerFileContent;
    }


    generatePython() : string {
        let pythonDockerFileContent = '';
        let ejsTemplate = fs.readFileSync(path.join(__dirname + '/../dockerfile-templates/python-docker-template.ejs')).toString();
        
        if (this.language === 'python' || this.language === 'python3'){
            pythonDockerFileContent = ejs.render(ejsTemplate, {
                imageTag: Images.PYTHON,
                runTime: "python3",
                fileName: this.filename
            });
        } else {
            pythonDockerFileContent = ejs.render(ejsTemplate, {
                imageTag: Images.PYTHON2,
                runTime: "python",
                fileName: this.filename
            })
        }

        return pythonDockerFileContent;
    }

}