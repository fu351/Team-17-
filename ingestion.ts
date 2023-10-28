import * as fs from 'fs';
import * as childProcess from 'child_process';
import axios from 'axios';


export async function pkg_download(score: number, pkg_name: string, registry_url: string){
    //check if package score is elgible for ingest to upload
    if(score>=0.5){
        //install the public package in currenty directory
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
                //change to directory of package
                process.chdir(pkg_name);
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

export async function reset_state(registryUrl: string){
    clearRegistry(registryUrl);
    //clear the link with registry
    fs.unlinkSync('.npmrc');
    //reset to default public registry
    const defaultRegistryUrl = 'https://registry.npmjs.org/';
    fs.writeFileSync('.npmrc', `registry=${defaultRegistryUrl}`);

}

async function clearRegistry(registryUrl: string): Promise<void> {
    try {
      // Fetch a list of all packages in the registry
      const response = await axios.get(`${registryUrl}/-/all`);
      const packages = response.data;
  
      // Iterate through the packages and remove each one
      for (const packageName of Object.keys(packages)) {
        await axios.delete(`${registryUrl}/${packageName}`);
        console.log(`Package ${packageName} deleted.`);
      }
  
      console.log('Registry cleared successfully.');
    } catch (error) {
      console.error(`Error clearing registry: ${error.message}`);
    }
  }
  