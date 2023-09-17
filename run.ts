#!/usr/bin/env node_modules/.bin/ts-node
import * as yargs from 'yargs';
import { exec } from 'child_process';

//How to run the code (right now)
//compile using $tsc run.ts
//provide permissions using $chmod +x run.js
//run any command using ./run.js <command>

const packagesToInstall = ['yargs', 'child_process'];

// Define the 'install' command
yargs.command({
  command: 'install',
  describe: 'Install user dependencies',
  handler: () => {
    console.log('Installing user dependencies...\n');
    installDependencies(packagesToInstall);
    
  },
});

yargs.command({
  command: 'URL_FILE',
  describe: 'Asbolute Location of URLs',
  handler: () => {
    console.log('Getting URLs for NetScore calculations....');
  },
});

yargs.command({
  command: 'test',
  describe: 'Run pre-made test cases',
  handler: () => {
    console.log('Running test cases...\n Github Packages loading...\n NPM Packages loading...\nFinished!');
  },
});

yargs.argv;

function installDependencies(packages: string[]) {
  for(const packageName of packages) {
    const command = `npm install ${packageName} --save`;

    const subProcess1 = exec(command, (error, combinedOutput) => {
      if(error) {
        console.error(`Error installing ${packageName}: `, error.message);
      }
      else {
        console.log(`${packageName} successfully installed:\n`, combinedOutput);
      }
    });

    subProcess1.stdout.on('data', (data) => {
      //console.log(data);
    });

    subProcess1.stderr.on('data', (data) => {
      //console.log(data);
    });
  } 
}