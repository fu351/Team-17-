import * as fs from 'fs';
import * as childProcess from 'child_process';
import axios from 'axios';


export async function pkg_download(score: number, pkg_name: string, registry_url: string){
    //check if package score is elgible for ingest to upload
    if(score>=0.5){
        //install the public package
        const command = `npm install -g ${pkg_name}`; 
        //execut the install command
        childProcess.exec(command, (error, stdout, stderr) => {
            if (error) { 
                console.error(`Error: ${error.message}`);

            } else {
                console.log(`Package downloaded successfully!`);
                console.log(`stdout: ${stdout}`);
                //configure private registry for upload
                fs.writeFileSync('.npmrc', `registry=${registry_url}`);
                //publish the qualified package to registry
                childProcess.exec('npm publish', (error, stderr) => {
                    if (error) {
                      console.error(`Error: ${error.message}`);
                      return;
                    }else{
                        console.log(`Package published successfully!`);
                    }
                  });
            }
        });
    }else{
        console.error('Package metrics do not meet the required criteria.');
    }
}

export async function reset_state(){
    //clear the private registry
    fs.unlinkSync('.npmrc');
    //reset to default public registry
    const defaultRegistryUrl = 'https://registry.npmjs.org/';
    fs.writeFileSync('.npmrc', `registry=${defaultRegistryUrl}`);

}