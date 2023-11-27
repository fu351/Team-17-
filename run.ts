#!/usr/bin/env node
import * as yargs from 'yargs'
import {
  fetchGitHubInfo,
  readLines,
  countLinesInFile,
} from './npm-github-netscore'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

const ndjsonEntries: string[] = []

yargs
  .option('url', {
    alias: 'u',
    describe: 'URL to process',
  })
  .command({
    command: 'URL_FILE <filepath>',
    describe: 'Location of URLs',
    handler: async (argv) => {
      const filepath = argv.filepath
      try {
        if (!process.env.LOG_FILE) {
          console.error('Error: No LOG_FILE found in .env file')
          process.exit(1)
        } else if (!process.env.GITHUB_TOKEN) {
          console.error('Error: No GITHUB_TOKEN found in .env file')
          process.exit(1)
        }
        const decodedURLs = await readLines(filepath)
        //const numLines = await countLinesInFile(filepath)
        try {
          const ndjsonEntryPromise = fetchGitHubInfo(
            decodedURLs[0],
            process.env.GITHUB_TOKEN,
          )
          if (ndjsonEntryPromise) {
            const ndjsonEntry = await ndjsonEntryPromise
            console.log(ndjsonEntry)
            if (typeof ndjsonEntry === 'string') {
              // Check if it's a string
              ndjsonEntries.push(ndjsonEntry)
            } else {
              console.error('Error: Unexpected result from fetchGitHubInfo')
              process.exit(1)
            }
          }
        } catch (error) {
          console.error('An error occurred during processing:', error)
          process.exit(1)
        }
      } catch (error) {
        console.error('An error occurred before processing:', error)
        process.exit(1)
      }
      process.exit(0)
    },
  })
yargs
  .command({
    command: 'test',
    describe: 'Run pre-made test cases',
    handler: () => {
      //console.log('Running test cases...\nGithub Packages loading...\nNPM Packages loading...\nFinished!');
      const num_passed = 0
      const total_tests = 0
      const coverage_pct = 0
      console.log(
        `${num_passed}/${total_tests} test cases passed. ${coverage_pct}% line coverage achieved.`,
      )
      process.exit(0)
    },
  })
  .help().argv
