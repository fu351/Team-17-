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