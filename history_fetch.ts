import axios from 'axios';
import * as semver from 'semver';

async function fetchPackageHistory(packageName: string, versionRange: string): Promise<any[]> {
  try {
    // Fetch package metadata from the registry
    const { data: metadata } = await axios.get(`https://registry.npmjs.org/${packageName}`);

    // Extract versions
    const allVersions = Object.keys(metadata.versions);

    // Filter versions based on the specified range
    const filteredVersions = allVersions.filter((version) => {
      return semver.satisfies(version, versionRange);
    });

    // Fetch history for each version
    const versionHistory = await Promise.all(
      filteredVersions.map(async (version) => {
        const { data: versionInfo } = await axios.get(`https://registry.npmjs.org/${packageName}/${version}`);
        return versionInfo;
      })
    );

    return versionHistory;
  } catch (error) {
    console.error(`Error fetching package history: ${error.message}`);
    throw error;
  }
}

/*
// Example usage
const packageName = 'json-schema-traverse';
const versionRange = '0.3.0'; // Use the desired version range

fetchPackageHistory(packageName, versionRange)
  .then((history) => {
    console.log('Package History:', history);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  */
