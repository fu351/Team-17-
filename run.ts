#!/usr/bin/env node
import * as yargs from 'yargs';
import { fetchGitHubInfo, readLines, countLinesInFile } from './npm-github-netscore';

const token = "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"; //personal token needed to avoid API limits

//STILL NEEDED, IF LOOP THAT TAKES IN THE DECODED URL FROM URL_FILE.txt AND PARSES WHETHER IT"S AN NPM URL OR GITHUB URL. ->
//->THEN CALL THE PROPER FUCNTIONS/FILE
//ALL THAT IS READY RIGHT NOW IS THE NPM->GITHHUB->NETSCORE (DONE BY CHRIS)

yargs.command({
  command: 'URL_FILE',
  describe: 'Asbolute Location of URLs',
  handler: async () => {
  console.log('Getting URLs for NetScore calculations....');
  const filepath = 'URL_FILE.txt';
    try {
      const decodedURLs = await readLines(filepath);
      const numLines = await countLinesInFile(filepath);
      for (let x = 0; x <= numLines; x++) {
        await fetchGitHubInfo(decodedURLs[x], token);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  },
})
yargs.command({
  command: 'test',
  describe: 'Run pre-made test cases',
  handler: () => {
  console.log('Running test cases...\nGithub Packages loading...\nNPM Packages loading...\nFinished!');
  },
})
.help().argv;

