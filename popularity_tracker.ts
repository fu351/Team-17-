export async function getPopularity(response: any) {
    //Use API request to get the download and stars count
    //Use API request to get the number of forks
    //Get the stars count
    const data = response.data;
    const stars_count = data.stargazers_count;
    const forks_count = data.forks_count;
    let download_count = 0;
    if (data.releases) {
        for (const release of data.releases) {
          if (release.assets) {
            for (const asset of release.assets) {
              download_count += asset.download_count;
            }
          }
        }
      }
    const dependents_count = data.dependents_count;
    let download_score = 0;
    let stars_score = 0;
    let forks_score = 0;
    let dependents_score = 0;
    //Calculate the download score on a scale of 0 to 1
    if (download_count > 100000) {
        download_score = 1;
    }
    else {
        download_score = download_count / 100000;
    }
    //Calculate the stars score on a scale of 0 to 1
    if (stars_count > 50000) {
        stars_score = 1;
    }
    else {
        stars_score = stars_count / 50000;
    }
    //Calculate the forks score on a scale of 0 to 1
    if (forks_count > 30000) {
        forks_score = 1;
    }
    else {
        forks_score = forks_count / 30000;
    }
    //Calculate the dependents score on a scale of 0 to 1
    if (dependents_count > 100) {
        dependents_score = 1;
    }
    else {
        dependents_score = dependents_count / 100;
    }
    //Calculate the popularity score on a scale of 0 to 1
    const popularity = download_score / 4 + stars_score / 4 + forks_score / 4 + dependents_score / 4;
    return popularity;
}