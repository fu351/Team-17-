//uses REST api and url to get basic data from github needed for metrics.ts
async function getRepoDetails(owner, repo, token) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  return response.data;
}

// find the license of the github repo and return the license keyword name as a string
async function getRepoLicense(owner, repo, token) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/license`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  return response.data.license.name;
}

async function getContributorCommits(owner, repo) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`);
  const contributorCommits = response.data.map(contributor => contributor.total);
  return contributorCommits;
}

// Example usage:
getContributorCommits('Microsoft', 'TypeScript').then(contributorCommits => {
  console.log(`Number of commits by each contributor: ${contributorCommits}`);
}).catch(error => {
  console.error(error);
});