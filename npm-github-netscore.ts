const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import * as fs from 'fs';
import * as path from 'path';
import { calculate_net_score } from './metrics'

const perPage = 100; // Number of contributors per page, GitHub API maximum is 100
const perPage1 = 1; // We only need the latest commit

async function readLines(filePath: string): Promise<string[]> {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const decodedURLs: string[] = [];

  const lines = fileContents.split('\n');
  for (const line of lines) {
    const asciiCodes = line.trim().split(' ').map(Number);
    const decodedText = asciiCodes.map(code => String.fromCharCode(code)).join('');
    decodedURLs.push(decodedText);
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

async function getContributorsCount(getUsername: string, repositoryName: string, axiosConfig: any): Promise<number | null> {
  try {
    const repositoryInfoResponse = await axios.get(`https://api.github.com/repos/${getUsername}/${repositoryName}`, axiosConfig);
    const contributorsUrl = `${repositoryInfoResponse.data.contributors_url}?per_page=${perPage}`;

    let allContributors = [];
    let page = 1;

    while (true) {
      const contributorsResponse = await axios.get(`${contributorsUrl}&page=${page}`, axiosConfig);
      const contributors = contributorsResponse.data;

      if (contributors.length === 0) {
        break; // No more contributors
      }

      allContributors = allContributors.concat(contributors);
      page++;

      // Check for the Link header to determine if there are more pages
      const linkHeader = contributorsResponse.headers.link;
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break; // No more pages
      }
    }

    // Return the total contributor count
    return allContributors.length;
  } catch (error) {
    console.error('Error fetching contributor count:', error);
    return null;
  }
}

async function getIssues(getUsername: string, repositoryName: string) {
  try {
    const issuesUrl = `https://api.github.com/repos/${getUsername}/${repositoryName}/issues?per_page=${perPage}`;

    let allIssues = [];
    let page = 1;

    while (true) {
      const issuesResponse = await axios.get(`${issuesUrl}&page=${page}`);
      const issues = issuesResponse.data;

      if (issues.length === 0) {
        break; // No more issues
      }

      allIssues = allIssues.concat(issues);
      page++;

      // Check for the Link header to determine if there are more pages
      const linkHeader = issuesResponse.headers.link;
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break; // No more pages
      }
    }

    return allIssues;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
}

async function getIssueCount(getUsername: string, repositoryName: string, axiosConfig:any) {
  try {
    const issues = await getIssues(getUsername, repositoryName);
    const issueCount = issues.length;

    return issueCount;
  } catch (error) {
    console.error('Error fetching issue count:', error);
    throw error;
  }
}

async function getCommits(getUsername: string, repositoryName: string) {
  try {
    const commitsUrl = `https://api.github.com/repos/${getUsername}/${repositoryName}/commits?per_page=${perPage}`;

    let allCommits = [];
    let page = 1;

    while (true) {
      const commitsResponse = await axios.get(`${commitsUrl}&page=${page}`);
      const commits = commitsResponse.data;

      if (commits.length === 0) {
        break; // No more commits
      }

      allCommits = allCommits.concat(commits);
      page++;

      // Check for the Link header to determine if there are more pages
      const linkHeader = commitsResponse.headers.link;
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break; // No more pages
      }
    }

    return allCommits;
  } catch (error) {
    console.error('Error fetching commits:', error);
    throw error;
  }
}

async function getCommitsPerContributor(getUsername: string, repositoryName: string, axiosConfig: any) {
  try {
    const commits = await getCommits(getUsername, repositoryName);

    // Calculate the number of commits per contributor
    const commitsPerContributor = commits.reduce((result, commit) => {
      const contributor = commit.author?.login || 'Unknown';

      if (!result[contributor]) {
        result[contributor] = 1;
      } else {
        result[contributor]++;
      }

      return result;
    }, {});

    // Extract the commit counts into an array
    const commitCountsArray = Object.values(commitsPerContributor);

    // Return the array of commit counts
    return commitCountsArray;
  } catch (error) {
    console.error('Error fetching commits per contributor:', error);
    throw error;
  }
}

async function getLatestCommit(getUsername: string, repositoryName: string) {
  try {
    const commitsUrl = `https://api.github.com/repos/${getUsername}/${repositoryName}/commits?per_page=${perPage1}`;

    const latestCommitResponse = await axios.get(commitsUrl);
    const latestCommit = latestCommitResponse.data[0];

    return latestCommit;
  } catch (error) {
    console.error('Error fetching latest commit:', error);
    throw error;
  }
}

async function getTimeSinceLastCommit(getUsername: string, repositoryName: string, axiosConfig:any): Promise<number | null> {
  try {
    const latestCommit = await getLatestCommit(getUsername, repositoryName);

    if (!latestCommit) {
      console.log('No commits found in the repository.');
      return 0;  // Return 0 days if there are no commits
    }

    const lastCommitDate = new Date(latestCommit.commit.author?.date);
    const currentDate = new Date();

    const timeSinceLastCommitInMilliseconds = currentDate.getTime() - lastCommitDate.getTime();

    // Convert milliseconds to days
    const days = Math.floor(timeSinceLastCommitInMilliseconds / (1000 * 60 * 60 * 24));

    return days;  // Return the number of days
  } catch (error) {
    console.error('Error calculating time since last commit:', error);
    throw error;
  }
}


async function extractGitHubInfo(npmPackageUrl: string): Promise<{ username: string; repository: string } | null> {
  try {
    // Check if the URL is a valid npm package URL
    const npmUrlPattern = /^https?:\/\/(www\.)?npmjs\.com\/package\/([^/]+)/i;
    const npmUrlMatch = npmPackageUrl.match(npmUrlPattern);

    if (!npmUrlMatch || npmUrlMatch.length < 3) {
      throw new Error('Invalid npm package URL.');
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
    const githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
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
        throw new Error('Unable to extract GitHub username and repository name from the repository URL.');
      }
    }
  } catch (error) {
    console.error('Error extracting GitHub info:', error.message);
    return null;
  }
}

async function cloneREPO(username: string, repository: string) {
  try {
    const repoUrl = `https://github.com/${username}/${repository}.git`;
    const destinationPath = `cli_storage/${repository}`;
    const cloneCommand = `git clone ${repoUrl} ${destinationPath}`;

    const { stdout, stderr } = await exec(cloneCommand);

  } catch (error) {
    console.error(`Error cloning repository: ${error.message}`);
  }
}

async function getRepoLicense(username: string, repoName: string): Promise<string | null> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

    if (response.data.license) {
      const license = response.data.license;
      if (license.name) {
        return license.name;
      } else {
        console.log('No license type found for this repository.');
        return null;
      }
    } else {
      console.log('No license information found for this repository. Continuing as Unlicensed.');
      return null;
    }
  } catch (error) {
    console.error(`Error fetching repository information: ${error.message}`);
    return null;
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
  console.error(`Error reading file: ${filePath}`, error);
  return 0; // Return 0 lines in case of an error
}
}


async function fetchGitHubInfo(npmPackageUrl: string, personalAccessToken: string) {
  try {
    const githubInfo = await extractGitHubInfo(npmPackageUrl);

    if (githubInfo) {
      // Modify the headers to include the personal access token
      const headers = {
        Authorization: `Bearer ${personalAccessToken}`,
      };

      // Use axios with the modified headers
      const axiosConfig = {
        headers,
      };

      //gather info
      await cloneREPO(githubInfo.username, githubInfo.repository);
      const days_since_last_commit: number = await getTimeSinceLastCommit(githubInfo.username, githubInfo.repository, axiosConfig) as number;
      const issue_count: number = await getIssueCount(githubInfo.username, githubInfo.repository, axiosConfig) as number;
      const total_contributors: number = await getContributorsCount(githubInfo.username, githubInfo.repository, axiosConfig) as number;
      const contributor_commits: number[] = await getCommitsPerContributor(githubInfo.username, githubInfo.repository, axiosConfig) as number[];
      const repolicense: string = await getRepoLicense(githubInfo.username, githubInfo.repository) as string;
      const rootDirectory = `./cli_storage/${githubInfo.repository}`;
      const totalLines = await traverseDirectory(rootDirectory);
      const total_lines = totalLines[1] - totalLines[0];

      //calculate netscore and all metrics
      console.log(`Package Name: ${githubInfo.repository}`);
      let netscore: number[] = await calculate_net_score(contributor_commits, total_contributors, total_lines, issue_count, totalLines[0], repolicense, days_since_last_commit);
      console.log(`Metrics and Netscore: ${netscore}`);

    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { fetchGitHubInfo, readLines, countLinesInFile };




