import * as fs from 'fs';
import * as childProcess from 'child_process';
import axios from 'axios';

export async function pkg_upload(score: number, pkg_path: string){
    //check if file directory exist
    if (fs.existsSync(pkg_path)){
        //check if package score is elgible for ingest to upload
        if(score>=0.5){
            //publish the ingestible package
            const command = `npm publish ${pkg_path}`; 
            //execut the bash command
            childProcess.exec(command, (error, stdout, stderr) => {
                if (error) { 
                    console.error(`Error: ${error.message}`);
                } else {
                    console.log(`Package uploaded successfully!`);
                    console.log(`stdout: ${stdout}`);
                }
            });
        }else{
            console.error('Package metrics do not meet the required criteria.');
        }
    }else{
        console.error(`Package directory ${pkg_path} does not exist.`);
    }
}