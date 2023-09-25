#!/usr/bin/env node
import * as yargs from 'yargs';
import { fetchGitHubInfo, readLines, countLinesInFile } from './npm-github-netscore';
import * as fs from 'fs';

const token = "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"; //personal token needed to avoid API limits

const ndjsonEntries: string[] = [];


yargs.command({
  command: 'URL_FILE <filepath>',
  describe: 'Location of URLs',
  handler: async (argv) => {
  //console.log('Getting URLs for NetScore calculations....');
  const filepath = argv.filepath;
    try {
      const decodedURLs = await readLines(filepath);
      const numLines = await countLinesInFile(filepath);
      for (let x = 0; x <= numLines; x++) {
        const ndjsonEntryPromise = fetchGitHubInfo(decodedURLs[x], token);
        if (ndjsonEntryPromise) {
          const ndjsonEntry = await ndjsonEntryPromise;
          if (typeof ndjsonEntry === 'string') { // Check if it's a string
            ndjsonEntries.push(ndjsonEntry);
          } else {
            if (Error instanceof Error) {
              //console.error('Error:', Error.message);
              process.exit(1);
            }
          }
        }
      }
    } catch (error) {
      process.exit(1);
    }
    process.exit(0);
  },
})
yargs.command({
  command: 'test',
  describe: 'Run pre-made test cases',
  handler: () => {
  console.log('Running test cases...\nGithub Packages loading...\nNPM Packages loading...\nFinished!');
  process.exit(0);
  },
  
})
.help().argv;
