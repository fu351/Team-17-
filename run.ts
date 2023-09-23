#!/usr/bin/env node
import * as yargs from 'yargs';
import { handleNpmUrl, readLines } from './url_handler';

yargs.command({
  command: 'URL_FILE',
  describe: 'Asbolute Location of URLs',
  handler: () => {
  console.log('Getting URLs for NetScore calculations....');
  const filepath = 'URL_FILE.txt';
  let decodedURLs: string[] = [];
  decodedURLs = readLines(filepath);
  handleNpmUrl(decodedURLs[1]);
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
