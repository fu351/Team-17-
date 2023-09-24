import axios from 'axios';

const github_data = {
    "token":"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",
    "username": "LihongWu21"
}
async function getRepoLicenses(username: string, repoName: string) {
  try {
    // Send a GET request to the GitHub API to fetch repository information
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

    // Check if the repository has a license
    if (response.data.license) {
      const license = response.data.license;
      console.log(`License Type: ${license.name}`);
    } else {
      console.log('No license information found for this repository.');
    }
  } catch (error) {
    console.error(`Error fetching repository information: ${error.message}`);
  }
}

// Replace 'your-username' and 'your-repo' with the GitHub repository you want to analyze
const username = 'fu351';
const repoName = 'Team-17-';

getRepoLicenses(username, repoName);
