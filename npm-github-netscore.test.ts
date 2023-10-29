import {
  logBasedOnVerbosity,
  readLines,
  countLinesInFile,
  getCommitsPerContributor,
  getLatestCommit,
  getTimeSinceLastCommit,
  extractGitHubInfo,
  cloneREPO,
  addLists,
  traverseDirectory,
  countLines,
  fetchGitHubInfo
} from './npm-github-netscore'
// import * as functions from '../src/npm-github-netscore'

describe('logBasedOnVerbosity', () => {
  const debugLogger = {
    debug: jest.fn()
  };
  const infoLogger = {
    info: jest.fn()
  };

  it('should log info messages if verbosity is 1', async () => {
    process.env.LOG_LEVEL = "1";
    const testmessage = "Test of logger";
    logBasedOnVerbosity(testmessage, 1);
    expect(debugLogger.debug).toHaveBeenCalledTimes(0);
    expect(infoLogger.info).toHaveBeenCalledTimes(1);
    
  })
  it('should log debug messages if verbosity is 2', async () => {
    process.env.LOG_LEVEL = "2";
    const testmessage = "Test of logger";
    logBasedOnVerbosity(testmessage, 2);
    expect(debugLogger.debug).toHaveBeenCalledTimes(1);
    expect(infoLogger.info).toHaveBeenCalledTimes(0);
  })
  it('should not log if verbosity is different than loglevel', async () => {
    process.env.LOG_LEVEL = "1";
    const testmessage = "Test of logger";
    logBasedOnVerbosity(testmessage, 2);
    expect(debugLogger.debug).toHaveBeenCalledTimes(0);
    expect(infoLogger.info).toHaveBeenCalledTimes(0);
  })
})

describe('addLists', () => {
  it('should return a single list', async () => {
    const list1 = [1, 2, 3];
    const list2 = [4, 5, 6];
    const list3 = addLists(list1, list2);
    expect(list3.length).toBe(3);
    expect(list3[0]).toBe(5);
    expect(list3[1]).toBe(7);
    expect(list3[2]).toBe(9);
  })
  it('should return a single list', async () => {
    const list1 = [];
    const list2 = [4, 5, 6];
    expect(() => addLists(list1, list2)).toThrowError("Lists must have the same length for element-wise addition.");
  })
})