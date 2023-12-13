"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.countLinesInFile = exports.readLines = exports.fetchGitHubInfo = void 0;
var axios = require('axios');
var util = require('util');
var exec = util.promisify(require('child_process').exec);
var fs = require("fs");
var path = require("path");
var metrics_1 = require("./metrics");
var logger_1 = require("./logger");
var popularity_tracker_1 = require("./popularity_tracker");
function logBasedOnVerbosity(message, verbosity) {
    var logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 0;
    if (verbosity == logLevel) {
        if (verbosity == 2) {
            logger_1.debugLogger.debug(message);
        }
        else {
            logger_1.infoLogger.info(message);
        }
    }
}
function readLines(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents, decodedURLs, lines, _i, lines_1, line;
        return __generator(this, function (_a) {
            fileContents = fs.readFileSync(filePath, 'utf-8');
            decodedURLs = [];
            lines = fileContents.split('\n');
            for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                line = lines_1[_i];
                decodedURLs.push(line.trim());
            }
            return [2 /*return*/, decodedURLs];
        });
    });
}
exports.readLines = readLines;
function countLinesInFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            var lines = data.split('\n');
                            var numberOfLines = lines.length - 1; // Adjusting for empty line at EOF
                            resolve(numberOfLines);
                        }
                    });
                })];
        });
    });
}
exports.countLinesInFile = countLinesInFile;
function getCommitsPerContributor(getUsername, repositoryName, personalAccessToken) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var cursor, numCalls, commitsPerContributor, hasNextPage, query, variables, response, data, refs, _i, refs_1, ref, commits, _e, commits_1, commit, contributor, commitCountsArray, error_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 5, , 6]);
                    cursor = null;
                    numCalls = 0;
                    commitsPerContributor = {};
                    hasNextPage = true;
                    _f.label = 1;
                case 1:
                    if (!(numCalls <= 10 && hasNextPage)) return [3 /*break*/, 4];
                    numCalls++;
                    query = "\n        query($owner: String!, $name: String!, $cursor: String) {\n          repository(owner: $owner, name: $name) {\n            refs(first: 100, after: $cursor, refPrefix: \"refs/\") {\n              pageInfo {\n                endCursor\n                hasNextPage\n              }\n              nodes {\n                name\n                target {\n                  ... on Commit {\n                    history {\n                      totalCount\n                      nodes {\n                        author {\n                          user {\n                            login\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      ";
                    variables = {
                        owner: getUsername,
                        name: repositoryName,
                        cursor: cursor
                    };
                    return [4 /*yield*/, fetch('https://api.github.com/graphql', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(personalAccessToken)
                            },
                            body: JSON.stringify({ query: query, variables: variables })
                        })];
                case 2:
                    response = _f.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _f.sent();
                    if (!data || !data.data || !data.data.repository) {
                        logBasedOnVerbosity("No commits per contributor obtained: Invalid response from GraphQL API", 1);
                        return [2 /*return*/, 0];
                    }
                    refs = data.data.repository.refs.nodes;
                    cursor = data.data.repository.refs.pageInfo.endCursor;
                    hasNextPage = data.data.repository.refs.pageInfo.hasNextPage;
                    for (_i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
                        ref = refs_1[_i];
                        commits = ((_b = (_a = ref.target) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.nodes) || [];
                        for (_e = 0, commits_1 = commits; _e < commits_1.length; _e++) {
                            commit = commits_1[_e];
                            contributor = ((_d = (_c = commit.author) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.login) || 'Unknown';
                            if (!commitsPerContributor[contributor]) {
                                commitsPerContributor[contributor] = 1;
                            }
                            else {
                                commitsPerContributor[contributor]++;
                            }
                        }
                    }
                    return [3 /*break*/, 1];
                case 4:
                    commitCountsArray = Object.values(commitsPerContributor);
                    return [2 /*return*/, commitCountsArray];
                case 5:
                    error_1 = _f.sent();
                    //console.error('Error fetching commits per contributor:', error);
                    //throw error;
                    console.log(error_1);
                    logBasedOnVerbosity("No commits per contributor obtained", 1);
                    return [2 /*return*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getLatestCommit(getUsername, repositoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var commitsUrl, latestCommitResponse, latestCommit, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    commitsUrl = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/commits?per_page=1");
                    return [4 /*yield*/, axios.get(commitsUrl)];
                case 1:
                    latestCommitResponse = _a.sent();
                    latestCommit = latestCommitResponse.data[0];
                    return [2 /*return*/, latestCommit];
                case 2:
                    error_2 = _a.sent();
                    logBasedOnVerbosity("Error fetching latest commit: ".concat(error_2), 2);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getTimeSinceLastCommit(getUsername, repositoryName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var latestCommit, lastCommitDate, currentDate, timeSinceLastCommitInMilliseconds, days, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getLatestCommit(getUsername, repositoryName)];
                case 1:
                    latestCommit = _b.sent();
                    if (!latestCommit) {
                        logBasedOnVerbosity('No commits found in the repository', 1);
                        return [2 /*return*/, 0]; // Return 0 days if there are no commits
                    }
                    lastCommitDate = new Date((_a = latestCommit.commit.author) === null || _a === void 0 ? void 0 : _a.date);
                    currentDate = new Date();
                    timeSinceLastCommitInMilliseconds = currentDate.getTime() - lastCommitDate.getTime();
                    days = Math.floor(timeSinceLastCommitInMilliseconds / (1000 * 60 * 60 * 24));
                    return [2 /*return*/, days]; // Return the number of days
                case 2:
                    error_3 = _b.sent();
                    logBasedOnVerbosity("Error calculating time since last commit: ".concat(error_3), 2);
                    return [2 /*return*/, 0]; // Return 0 days if there are no commits
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractGitHubInfo(npmPackageUrl) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var githubUrlPattern, npmUrlPattern, npmUrlMatch, packageName, apiUrl, response, repositoryUrl, githubUrlMatch, username, repository, urlParts, username, repository, githubUrlMatch, username, repository, urlParts, username, repository, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
                    console.log(npmPackageUrl);
                    if (!!githubUrlPattern.test(npmPackageUrl)) return [3 /*break*/, 2];
                    npmUrlPattern = /^https?:\/\/(www\.)?npmjs\.com\/package\/([^/]+)/i;
                    npmUrlMatch = npmPackageUrl.match(npmUrlPattern);
                    if (!npmUrlMatch || npmUrlMatch.length < 3) {
                        logBasedOnVerbosity('Invalid npm package URL', 2);
                        return [2 /*return*/, null];
                    }
                    packageName = npmUrlMatch[2];
                    apiUrl = "https://registry.npmjs.org/".concat(packageName);
                    return [4 /*yield*/, axios.get(apiUrl)];
                case 1:
                    response = _c.sent();
                    repositoryUrl = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.url;
                    if (!repositoryUrl) {
                        throw new Error('No GitHub repository URL found for the package.');
                    }
                    githubUrlMatch = repositoryUrl.match(githubUrlPattern);
                    if (githubUrlMatch && githubUrlMatch.length >= 3) {
                        username = githubUrlMatch[1];
                        repository = githubUrlMatch[2];
                        return [2 /*return*/, { username: username, repository: repository }];
                    }
                    else {
                        urlParts = repositoryUrl.split('/');
                        if (urlParts.length >= 4) {
                            username = urlParts[urlParts.length - 2];
                            repository = urlParts[urlParts.length - 1].replace('.git', '');
                            return [2 /*return*/, { username: username, repository: repository }];
                        }
                        else {
                            logBasedOnVerbosity('Unable to extract GitHub username and repository name from the repository URL.', 2);
                            return [2 /*return*/, null];
                        }
                    }
                    return [3 /*break*/, 3];
                case 2:
                    githubUrlMatch = npmPackageUrl.match(githubUrlPattern);
                    if (githubUrlMatch && githubUrlMatch.length >= 3) {
                        username = githubUrlMatch[1];
                        repository = githubUrlMatch[2];
                        return [2 /*return*/, { username: username, repository: repository }];
                    }
                    else {
                        urlParts = npmPackageUrl.split('/');
                        if (urlParts.length >= 4) {
                            username = urlParts[urlParts.length - 2];
                            repository = urlParts[urlParts.length - 1].replace('.git', '');
                            return [2 /*return*/, { username: username, repository: repository }];
                        }
                        else {
                            logBasedOnVerbosity('Unable to extract GitHub username and repository name from the repository URL.', 2);
                            return [2 /*return*/, null];
                        }
                    }
                    _c.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_4 = _c.sent();
                    logBasedOnVerbosity("Error extracting GitHub info: ".concat(error_4.message), 2);
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function cloneREPO(username, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var repoUrl, destinationPath, cloneCommand, _a, stdout, stderr, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    repoUrl = "https://github.com/".concat(username, "/").concat(repository, ".git");
                    destinationPath = "cli_storage/".concat(repository);
                    cloneCommand = "git clone ".concat(repoUrl, " ").concat(destinationPath);
                    return [4 /*yield*/, exec(cloneCommand)];
                case 1:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _b.sent();
                    logBasedOnVerbosity("Error cloning repository: ".concat(error_5.message), 2);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addLists(list1, list2) {
    // Check if both lists have the same length
    if (list1.length !== list2.length) {
        throw new Error("Lists must have the same length for element-wise addition.");
    }
    // Use the map function to add elements element-wise
    var resultList = list1.map(function (value, index) { return value + list2[index]; });
    return resultList;
}
function traverseDirectory(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files, count, _i, files_1, file, filePath, stats, _a, _b, fileLineCount, fileLineCount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    files = fs.readdirSync(dir);
                    count = [0, 0];
                    _i = 0, files_1 = files;
                    _c.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    filePath = path.join(dir, file);
                    stats = fs.statSync(filePath);
                    if (!stats.isDirectory()) return [3 /*break*/, 3];
                    _a = addLists;
                    _b = [count];
                    return [4 /*yield*/, traverseDirectory(filePath)];
                case 2:
                    // If it's a directory, recursively traverse it
                    count = _a.apply(void 0, _b.concat([_c.sent()]));
                    return [3 /*break*/, 4];
                case 3:
                    if (stats.isFile()) {
                        // If it's a file, count the lines
                        if (!(filePath.includes('.txt'))) {
                            fileLineCount = countLines(filePath);
                            count[1] += fileLineCount;
                        }
                        if (filePath.includes("README.md")) {
                            fileLineCount = countLines(filePath);
                            count[0] += fileLineCount;
                        }
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, count];
            }
        });
    });
}
function countLines(filePath) {
    try {
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        var lines = fileContent.split('\n');
        return lines.length;
    }
    catch (error) {
        logBasedOnVerbosity("Error reading file: ".concat(filePath), 2);
        process.exit(1);
    }
}
function getDependencyData(getUsername, repositoryName, personalAccessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var axiosConfig, url, response, data, dependency_versions, assigned_dependencies, unassigned_dependencies, _i, dependency_versions_1, version;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    axiosConfig = {
                        headers: {
                            'Accept': 'application/vnd.github.hawkgirl-preview+json',
                            'Authorization': "token ".concat(personalAccessToken)
                        }
                    };
                    url = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/dependency-graph/sbom");
                    return [4 /*yield*/, axios.get(url, axiosConfig)];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    dependency_versions = data.sbom.packages.map(function (pkg) { return pkg.versionInfo; });
                    if (!dependency_versions) {
                        return [2 /*return*/, [0, 0]];
                    }
                    if (dependency_versions.length == 0) {
                        return [2 /*return*/, [0, 0]];
                    }
                    assigned_dependencies = 0;
                    unassigned_dependencies = 0;
                    for (_i = 0, dependency_versions_1 = dependency_versions; _i < dependency_versions_1.length; _i++) {
                        version = dependency_versions_1[_i];
                        if (version) {
                            assigned_dependencies++;
                        }
                        else {
                            unassigned_dependencies++;
                        }
                    }
                    return [2 /*return*/, [assigned_dependencies, unassigned_dependencies]];
            }
        });
    });
}
function getReviewedLines(getUsername, repositoryName, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, url2, response2, data2, commits, pull_requests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/pulls?state=closed");
                    return [4 /*yield*/, axios.get(url, token)];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    url2 = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/commits");
                    return [4 /*yield*/, axios.get(url2, token)];
                case 2:
                    response2 = _a.sent();
                    data2 = response2.data;
                    commits = data2.length;
                    pull_requests = data.length;
                    //console.log(`Commits: ${commits}, Pull Requests: ${pull_requests}`);
                    if (pull_requests / commits >= 1)
                        return [2 /*return*/, 1];
                    else
                        return [2 /*return*/, pull_requests / commits];
                    return [2 /*return*/];
            }
        });
    });
}
function getRepoLicense(response) {
    return __awaiter(this, void 0, void 0, function () {
        var repolicense, license;
        return __generator(this, function (_a) {
            repolicense = 'unlicense';
            if (response) {
                license = response;
                if (license.key) {
                    repolicense = license.key;
                }
                else {
                    logBasedOnVerbosity('No license type found for this repository.', 1);
                }
            }
            else {
                logBasedOnVerbosity('No license information found for this repository. Continuing as Unlicensed.', 1);
            }
            return [2 /*return*/, repolicense];
        });
    });
}
function fetchGitHubInfo(npmPackageUrl, personalAccessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var githubInfo, headers, axiosConfig, url, response, issue_count, contributor_commits, days_since_last_commit, repoLicense, code_review_score, rootDirectory, totalLines, total_lines, _a, assigned_dependencies, unassigned_dependencies, total_dependencies, popularity, scores, POPULARITY_rnd, scores, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 16, , 17]);
                    if (!(npmPackageUrl == "")) return [3 /*break*/, 1];
                    logBasedOnVerbosity("Empty line encountered", 1);
                    return [2 /*return*/, 0];
                case 1: return [4 /*yield*/, extractGitHubInfo(npmPackageUrl)];
                case 2:
                    githubInfo = _b.sent();
                    if (!githubInfo) return [3 /*break*/, 13];
                    headers = {
                        Authorization: "Bearer ".concat(personalAccessToken)
                    };
                    axiosConfig = {
                        headers: headers
                    };
                    url = "https://api.github.com/repos/".concat(githubInfo.username, "/").concat(githubInfo.repository);
                    return [4 /*yield*/, axios.get(url, axiosConfig)];
                case 3:
                    response = _b.sent();
                    //gather info
                    return [4 /*yield*/, cloneREPO(githubInfo.username, githubInfo.repository)];
                case 4:
                    //gather info
                    _b.sent();
                    issue_count = response.data.open_issues_count;
                    return [4 /*yield*/, getCommitsPerContributor(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 5:
                    contributor_commits = _b.sent();
                    console.log(";emngth", contributor_commits.length);
                    return [4 /*yield*/, getTimeSinceLastCommit(githubInfo.username, githubInfo.repository)];
                case 6:
                    days_since_last_commit = _b.sent();
                    return [4 /*yield*/, getRepoLicense(response.data.license)];
                case 7:
                    repoLicense = _b.sent();
                    return [4 /*yield*/, getReviewedLines(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 8:
                    code_review_score = _b.sent();
                    rootDirectory = "./cli_storage/".concat(githubInfo.repository);
                    return [4 /*yield*/, traverseDirectory(rootDirectory)];
                case 9:
                    totalLines = _b.sent();
                    total_lines = totalLines[1] - totalLines[0];
                    return [4 /*yield*/, getDependencyData(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 10:
                    _a = _b.sent(), assigned_dependencies = _a[0], unassigned_dependencies = _a[1];
                    total_dependencies = assigned_dependencies + unassigned_dependencies;
                    return [4 /*yield*/, (0, popularity_tracker_1.getPopularity)(response, total_dependencies)];
                case 11:
                    popularity = _b.sent();
                    console.log("Popularity: ".concat(popularity));
                    console.log("test");
                    console.log(totalLines, issue_count);
                    return [4 /*yield*/, (0, metrics_1.calculate_net_score)(contributor_commits, total_lines, issue_count, totalLines[0], repoLicense, days_since_last_commit, assigned_dependencies, unassigned_dependencies, code_review_score, npmPackageUrl)];
                case 12:
                    scores = _b.sent();
                    POPULARITY_rnd = Math.floor(popularity * 10000) / 10000;
                    scores.push(POPULARITY_rnd);
                    console.log(scores);
                    ////
                    ////
                    //// I have troubleshooted the earlier problem of not being able to recieve output from the calculate_net_score function into the scores constant
                    //// Below is how I am adding the json files to the github repository with the calculated net score and other information. 
                    //// You may need to change the file pathing to match the database storage location to work with our AWS S3 Bucket
                    ////
                    ////
                    //fs.writeFileSync(`./cli_storage/${githubInfo.repository}/netscore.json`, scores);
                    //fs.writeFileSync(`./cli_storage/${githubInfo.repository}/popularity.json`, JSON.stringify(popularity, null, 2));
                    //Reverted back to returning as array of variables instead of JSON files, planning to save netscore as attribute instead of saving json file
                    //Scores also contains the popularity score.
                    return [2 /*return*/, scores];
                case 13: return [4 /*yield*/, (0, metrics_1.calculate_net_score)([0], 0, 0, 0, 'unlicense', 0, 0, 0, 0, npmPackageUrl)];
                case 14:
                    scores = _b.sent();
                    scores.push(0); //Adding a 0 popularity score
                    return [2 /*return*/, scores];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_6 = _b.sent();
                    logBasedOnVerbosity("Error: ".concat(error_6.stack), 2);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.fetchGitHubInfo = fetchGitHubInfo;
