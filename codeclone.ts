import { exec } from 'child_process';


// Replace these values with the GitHub repository you want to clone
const repoUrl = 'https://github.com/dgtlmoon/changedetection.io.git';
const destinationPath = 'testPackage';

// Run the Git clone command
const cloneCommand = `git clone ${repoUrl} ${destinationPath} `;//

exec(cloneCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error cloning repository:${error.message}`);// 
    return;
  }
  /*if (stderr) {
    console.error(`Git error: ${stderr}`);
    return;
  }*/
  console.log(`Repository cloned to ${destinationPath}`);
});



