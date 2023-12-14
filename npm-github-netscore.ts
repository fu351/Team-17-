const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import * as fs from 'fs';
import * as path from 'path';
import { calculate_net_score } from './metrics'
import { infoLogger, debugLogger } from './logger';
import { log } from 'console';
import { getPopularity } from './popularity_tracker';

function logBasedOnVerbosity(message: string, verbosity: number) {
  const logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 0;

  if (verbosity == logLevel) {
    if(verbosity == 2) {
      debugLogger.debug(message);
    }
    else {
      infoLogger.info(message);
    }
  }
}

async function readLines(filePath: string): Promise<string[]> {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const decodedURLs: string[] = [];

  const lines = fileContents.split('\n');
  for (const line of lines) {
    decodedURLs.push(line.trim());
  }

  return decodedURLs;
}

async function countLinesInFile(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const lines = data.split('\n');
        const numberOfLines = lines.length - 1; // Adjusting for empty line at EOF
        resolve(numberOfLines);
      }
    });
  });
}
async function getContributors(owner:string , repo: string,personalAccessToken: string) {
  try{
  const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${personalAccessToken}`,

    },
  });
  const data = await response.json();
  let commitsPerContributor = {};
  for (const contributor of data) {
    //console.log(`User: ${contributor.login}, Contributions: ${contributor.contributions}`);
    commitsPerContributor[contributor.login] = contributor.contributions;
  }
  delete commitsPerContributor['Unknown'];
 // console.log("Array",commitsPerContributor);
  const commitCountsArray = Object.values(commitsPerContributor);
  
  return commitCountsArray;
  }catch (error) {
    //console.error('Error fetching commits per contributor:', error);
    //throw error;
    console.log(error);
    logBasedOnVerbosity("No commits per contributor obtained", 1);
    return 0;
  }
}

async function getLatestCommit(getUsername: string, repositoryName: string) {
  try {
    const commitsUrl = `https://api.github.com/repos/${getUsername}/${repositoryName}/commits?per_page=1`;

    const latestCommitResponse = await axios.get(commitsUrl);
    const latestCommit = latestCommitResponse.data[0];

    return latestCommit;
  } catch (error) {
    logBasedOnVerbosity(`Error fetching latest commit: ${error}`, 2);
    return 0;
  }
}

async function getTimeSinceLastCommit(getUsername: string, repositoryName: string): Promise<number | null> {
  try {
    const latestCommit = await getLatestCommit(getUsername, repositoryName);

    if (!latestCommit) {
      logBasedOnVerbosity('No commits found in the repository', 1);
      return 0;  // Return 0 days if there are no commits
    }

    const lastCommitDate = new Date(latestCommit.commit.author?.date);
    const currentDate = new Date();

    const timeSinceLastCommitInMilliseconds = currentDate.getTime() - lastCommitDate.getTime();

    // Convert milliseconds to days
    const days = Math.floor(timeSinceLastCommitInMilliseconds / (1000 * 60 * 60 * 24));

    return days;  // Return the number of days
  } catch (error) {
    logBasedOnVerbosity(`Error calculating time since last commit: ${error}`, 2);
    return 0; // Return 0 days if there are no commits
  }
}
async function extractGitHubInfo(npmPackageUrl: string): Promise<{ username: string; repository: string } | null> {
  try {
  const githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
    console.log(npmPackageUrl);
    //Checks if it is a github url if not treats it as a npm url
  if (!githubUrlPattern.test(npmPackageUrl)) {

    // Check if the URL is a valid npm package URL
    const npmUrlPattern = /^https?:\/\/(www\.)?npmjs\.com\/package\/([^/]+)/i;
    const npmUrlMatch = npmPackageUrl.match(npmUrlPattern);

    if (!npmUrlMatch || npmUrlMatch.length < 3) {
      logBasedOnVerbosity('Invalid npm package URL', 2);
      return null;
    }

    // Extract the package name
    const packageName = npmUrlMatch[2];

    // Fetch the package info from npm registry
    const apiUrl = `https://registry.npmjs.org/${packageName}`;
    const response = await axios.get(apiUrl);
    const repositoryUrl = response.data?.repository?.url;

    if (!repositoryUrl) {
      throw new Error('No GitHub repository URL found for the package.');
    }
  
    // Check if the repository URL follows the typical GitHub structure
    const githubUrlMatch = repositoryUrl.match(githubUrlPattern);
    if (githubUrlMatch && githubUrlMatch.length >= 3) {
      const username = githubUrlMatch[1];
      const repository = githubUrlMatch[2];
      return { username, repository };
    } else {
      // If the URL doesn't follow the typical structure, attempt to extract from the URL
      const urlParts = repositoryUrl.split('/');
      if (urlParts.length >= 4) {
        const username = urlParts[urlParts.length - 2];
        const repository = urlParts[urlParts.length - 1].replace('.git', '');
        return { username, repository };
      } else {
        logBasedOnVerbosity('Unable to extract GitHub username and repository name from the repository URL.', 2);
        return null;
      }
    }
  } else {
    const githubUrlMatch = npmPackageUrl.match(githubUrlPattern);

    if (githubUrlMatch && githubUrlMatch.length >= 3) {

      const username = githubUrlMatch[1];
      const repository = githubUrlMatch[2];
      return { username, repository };
    } else {
      // If the URL doesn't follow the typical structure, attempt to extract from the URL
      const urlParts = npmPackageUrl.split('/');
      if (urlParts.length >= 4) {
        const username = urlParts[urlParts.length - 2];
        const repository = urlParts[urlParts.length - 1].replace('.git', '');
        return { username, repository };
      } else {
        logBasedOnVerbosity('Unable to extract GitHub username and repository name from the repository URL.', 2);
        return null
      }
    }
  }
  } catch (error) {
    logBasedOnVerbosity(`Error extracting GitHub info: ${error.message}`, 2);
    console.log(error);
    //process.exit(1);
    return null
  }
}
async function cloneREPO(username: string, repository: string) {
  try {
    const repoUrl = `https://github.com/${username}/${repository}.git`;
    //if the repo is already cloned, delete it
    if (fs.existsSync(`cli_storage/${repository}`)) {
      const isWindows = process.platform === "win32";
      const deleteCommand = isWindows ? `rd /s /q cli_storage\\${repository}` : `rm -rf cli_storage/${repository}`;
      await exec(deleteCommand);
    }
    const destinationPath = `cli_storage/${repository}`;
    const cloneCommand = `git clone ${repoUrl} ${destinationPath}`;

    await exec(cloneCommand);

  } catch (error) {
    logBasedOnVerbosity(`Error cloning repository: ${error.message}`, 2);
    console.log(error);
    //process.exit(1);
  }
}

function addLists(list1: number[], list2: number[]): number[] {
  // Check if both lists have the same length
  if (list1.length !== list2.length) {
    throw new Error("Lists must have the same length for element-wise addition.");
  }

  // Use the map function to add elements element-wise
  const resultList: number[] = list1.map((value, index) => value + list2[index]);

  return resultList;
}

async function traverseDirectory(dir: string) {
const files = fs.readdirSync(dir); // Get all files and directories in the current directory
let count: number[] = [0, 0];

for (const file of files) {
  const filePath = path.join(dir, file); // Get the full path of the file or directory
  const stats = fs.statSync(filePath); // Get file/directory stats

  if (stats.isDirectory()) {
    // If it's a directory, recursively traverse it
    count = addLists(count, await traverseDirectory(filePath) );

  } else if (stats.isFile()) {
    // If it's a file, count the lines
    if(!(filePath.includes('.txt'))){  
      const fileLineCount = countLines(filePath);
      count[1] += fileLineCount;
    }
    if(filePath.includes("README.md")){
      const fileLineCount = countLines(filePath);
      count[0] += fileLineCount;
    }

  }
}
return count;
}

function countLines(filePath: string): number {
try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  return lines.length;
} catch (error) {
  logBasedOnVerbosity(`Error reading file: ${filePath}`, 2);
  console.log(error);//process.exit(1);
  return 0;
}
}
async function getDependencyData(getUsername: string, repositoryName: string, personalAccessToken: string) {
  //Gets the number of dependencies that are assigned and unassigned with a version number
  //The dependency data is in a sbom file in JSON format
  const axiosConfig = {
    headers: {
      'Accept': 'application/vnd.github.hawkgirl-preview+json',
      'Authorization': `token ${personalAccessToken}`
    }
  };
  const url = `https://api.github.com/repos/${getUsername}/${repositoryName}/dependency-graph/sbom`;
  const response = await axios.get(url, axiosConfig);
  const data = response.data;
  const dependency_versions = data.sbom.packages.map((pkg) => pkg.versionInfo);
  if (!dependency_versions) {
    return [0,0]
  }
  if (dependency_versions.length == 0) {
    return [0, 0];
  }
  let assigned_dependencies = 0;
  let unassigned_dependencies = 0;
  for (const version of dependency_versions) {
    if (version) {
      assigned_dependencies++;
    } else {
      unassigned_dependencies++;
    }
  }
  return [assigned_dependencies, unassigned_dependencies];


}

async function getReviewedLines(getUsername: string, repositoryName: string, token: any): Promise<any> {
  //find the total number of commits in the repo and the total number of closed pull requests in the repo
  const url = `https://api.github.com/repos/${getUsername}/${repositoryName}/pulls?state=closed`;
  const response = await axios.get(url, token);
  const data = response.data;
  //find the total number of commits in the repo as an number
  const url2 = `https://api.github.com/repos/${getUsername}/${repositoryName}/commits`;
  const response2 = await axios.get(url2, token);
  const data2 = response2.data;
  const commits = data2.length;
  const pull_requests = data.length;
  //console.log(`Commits: ${commits}, Pull Requests: ${pull_requests}`);
  if (pull_requests / commits >= 1)
    return 1;
  else
    return pull_requests / commits;
}

async function getRepoLicense(response: any): Promise<string> {
  let repolicense = 'unlicense';
  if (response) {
    const license = response;
    if (license.key) {
      repolicense = license.key;
    } else {
      logBasedOnVerbosity('No license type found for this repository.', 1);
    }
  } else {
    logBasedOnVerbosity('No license information found for this repository. Continuing as Unlicensed.', 1);
  }
  return repolicense;
}
async function fetchGitHubInfo(npmPackageUrl: string, personalAccessToken: string) {
  try {
    if (npmPackageUrl == "") {
      logBasedOnVerbosity("Empty line encountered", 1);
      return 0;
    }
    else {
      let githubInfo;
      try {
        githubInfo = await extractGitHubInfo(npmPackageUrl);
        console.log("extracted github info", githubInfo);
      } catch (error) {
        console.error("Error extracting GitHub info:", error);
        return;
      }
      if (githubInfo) {

        //console.log(githubInfo);
        // Modify the headers to include the personal access token
        const headers = {
          Authorization: `Bearer ${personalAccessToken}`,
        };

        // Use axios with the modified headers
        const axiosConfig = {
          headers,
        };
        const url = `https://api.github.com/repos/${githubInfo.username}/${githubInfo.repository}`;
        let response;
        try {
          response = await axios.get(url, axiosConfig);
        }
        catch (error) {
          console.log("request error");
          return;
        }
        //gather info
        console.log("got response");
        try {
        await cloneREPO(githubInfo.username, githubInfo.repository);
        }
        catch (error) {
          console.log("clone Error",error);
          return;
        }
        console.log("cloned repo")
        //
        const issue_count: number =  response.data.open_issues_count;
        //Add try catch block 
        let contributor_commits: number[];
        let days_since_last_commit: number;
        let repoLicense: string;
        let code_review_score: number;
        let totalLines: number[];
        let assigned_dependencies: number;
        let unassigned_dependencies: number;
        const rootDirectory = `./cli_storage/${githubInfo.repository}`;

        try {
           contributor_commits = await getContributors(githubInfo.username, githubInfo.repository, personalAccessToken) as number[];
        }
        catch (error) {
          console.log("error");
          return;
        }

        try {
        days_since_last_commit = await getTimeSinceLastCommit(githubInfo.username, githubInfo.repository) as number;
        } catch (error) {
          console.log("error");
          return;
        }
        try {
          repoLicense = await getRepoLicense(response.data.license);
        }
        catch (error) {
          console.log("error");
          return;
        }
        try {
          code_review_score = await getReviewedLines(githubInfo.username, githubInfo.repository, personalAccessToken);
        }
        catch (error) {
          console.log("error");
          return;
        }
        try {
          totalLines = await traverseDirectory(rootDirectory);
        }
        catch (error) {
          console.log("error");
          return;
        }
        try {
          [assigned_dependencies, unassigned_dependencies] = await getDependencyData(githubInfo.username, githubInfo.repository, personalAccessToken) as [number,number];
        }
        catch (error) {
          console.log("error");
          return;
        }
        
        const total_lines = totalLines[1] - totalLines[0];

        //calculate netscore and all metrics
        const total_dependencies = assigned_dependencies + unassigned_dependencies;
        
        //console.log(totalLines, issue_count);
        let scores;
        try {
          scores = await calculate_net_score(contributor_commits, total_lines, issue_count, totalLines[0], repoLicense, days_since_last_commit, assigned_dependencies, unassigned_dependencies, code_review_score, npmPackageUrl);
        }
        catch (error) {
          console.log("error");
          return;
        }
        let popularity;
        try {
          popularity = await getPopularity(response, total_dependencies);
        }
        catch (error) {
          console.log("error");
          return;
        }

        popularity = Math.floor(popularity * 10000) / 10000;
        scores.push(popularity);        

        console.log("completed");
        return scores
      }
      else {
        const scores = await calculate_net_score([0], 0, 0, 0, 'unlicense', 0, 0, 0, 0, npmPackageUrl);
        scores.push(0); //Adding a 0 popularity score
        return scores
      }

    }
  } catch (error) {
    logBasedOnVerbosity(`Error: ${error.stack}`, 2);
    //process.exit(1);
  }
}

export { fetchGitHubInfo, readLines, countLinesInFile , extractGitHubInfo};




