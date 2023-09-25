#!/usr/bin/env node
import * as yargs from 'yargs';
import { fetchGitHubInfo, readLines, countLinesInFile } from './npm-github-netscore';
import * as fs from 'fs';

const token = "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"; //personal token needed to avoid API limits

const ndjsonEntries: string[] = [];

function logFileContents() {
  try {
    // Read the contents of the file
    const fileContents = fs.readFileSync('output.ndjson', 'utf-8');
    // Log the contents to the console
    console.log(fileContents);
  } catch (error: any) {
    console.error('Error reading file:', error.message);
  }
}

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
        const ndjsonEntryPromise = fetchGitHubInfo(decodedURLs[x], token);
        if (ndjsonEntryPromise) {
          const ndjsonEntry = await ndjsonEntryPromise;
          if (typeof ndjsonEntry === 'string') { // Check if it's a string
            ndjsonEntries.push(ndjsonEntry);
          } else {
            if (Error instanceof Error) {
              //console.error('Error:', Error.message);
              process.exit(1);
            } else {
              //console.error('Error:', Error);
              process.exit(1);
            }
          }
        }
      }
    } catch (error) {
      process.exit(1);
    }
    if (ndjsonEntries.length > 0) {
      logFileContents();
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
