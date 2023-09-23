import { all } from "axios";

const getRepoInfo = async (owner: String, repo: String, token: String): Promise<any | null> => {
  const baseURL = 'https://api.github.com/repos';
  const url = `${baseURL}/${owner}/${repo}/collaborators`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'since': '2023-01-3100:00:000'
      },
    });

    if (response.ok) {
      const repositoryInfo = await response.json();
      return repositoryInfo;
      // console.log()
    } else {
      console.error(`Error: Unable to fetch data from GitHub API. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

const getCommitInfo = async (owner: String, repo: String, token: String): Promise<any | null> => {
  const baseURL = 'https://api.github.com/repos';
  const url = `${baseURL}/${owner}/${repo}/commits`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'since': '2023-01-3100:00:000'
      },
    });

    if (response.ok) {
      const repositoryInfo = await response.json();
      return repositoryInfo;
    } else {
      console.error(`Error: Unable to fetch data from GitHub API. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

const getIssueInfo = async (owner: String, repo: String, token: String): Promise<any | null> => {
  const baseURL = 'https://api.github.com/repos';
  const url = `${baseURL}/${owner}/${repo}/issues`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'issues': 'all'
      },
    });

    if (response.ok) {
      const repositoryInfo = await response.json();
      return repositoryInfo;
    } else {
      console.error(`Error: Unable to fetch data from GitHub API. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

function getTimeSinceCommit(commitDate: Date): string {
  const currentDate = new Date();
  const timeDifferenceInSeconds = Math.floor((currentDate.getTime() - commitDate.getTime()) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} seconds ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

const owner = 'fu351';
const repo = 'Team-17-';
// NEED TO ADD TOKEN
const token = '';
const allCommitsByCollaborators: number[] = [];

getRepoInfo(owner, repo, token)
  .then((collaboratorInfo) => {
    if (collaboratorInfo) {
      // Collaborator Info
      const collaboratorNames = collaboratorInfo.map((collaborator) => collaborator.login);
      const numberOfCollaborators = collaboratorInfo.length;
      console.log('Collaborator Names:', collaboratorNames);
      console.log('Number of Collaborators:', numberOfCollaborators);

      getCommitInfo(owner, repo, token)
        .then((commitInfo) => {
          if(commitInfo){
            console.log('All commits:', commitInfo.length)

            // Commits per collaborator
            for (const collaborator of collaboratorNames) {
              const commitsByCollaborator = commitInfo.filter((commit) => commit.author?.login === collaborator);
              if (commitsByCollaborator) {
                allCommitsByCollaborators.push(commitsByCollaborator.length);
              }
            }
            console.log('Commits by Collaborators:', allCommitsByCollaborators);

            // Days since last commit
            const latestCommit = commitInfo[0];
            const latestCommitDate = new Date(latestCommit.commit.author.date)
            const timeSinceCommit = getTimeSinceCommit(latestCommitDate);
            console.log('Time Since Commit:', timeSinceCommit);
        }})
    }
  })
  .catch((error) => {
    console.error(`Error: ${error}`);
  });

getIssueInfo(owner, repo, token)
  .then((issuesInfo) => {
    if (issuesInfo) {
      // Issues
      const openIssues = issuesInfo.filter((issue) => issue.state === 'open');
      const numberOfOpenIssues = openIssues.length;
      const closeIssues = issuesInfo.filter((issue) => issue.state === 'close');
      const numberOfCloseIssues = closeIssues.length;
      console.log('Number of issues: ', openIssues.length);
      console.log('Open Issues: ', numberOfOpenIssues);
      console.log('Close Issues: ', numberOfCloseIssues);
    }
  })
  .catch((error) => {
    console.error(`Error: ${error}`);
  });




  