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
var perPage = 100; // Number of contributors per page, GitHub API maximum is 100
var perPage1 = 1; // We only need the latest commit
function readLines(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents, decodedURLs, lines, _i, lines_1, line, asciiCodes, decodedText;
        return __generator(this, function (_a) {
            fileContents = fs.readFileSync(filePath, 'utf-8');
            decodedURLs = [];
            lines = fileContents.split('\n');
            for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                line = lines_1[_i];
                asciiCodes = line.trim().split(' ').map(Number);
                decodedText = asciiCodes.map(function (code) { return String.fromCharCode(code); }).join('');
                decodedURLs.push(decodedText);
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
function getContributorsCount(getUsername, repositoryName, axiosConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var repositoryInfoResponse, contributorsUrl, allContributors, page, contributorsResponse, contributors, linkHeader, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, axios.get("https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName), axiosConfig)];
                case 1:
                    repositoryInfoResponse = _a.sent();
                    contributorsUrl = "".concat(repositoryInfoResponse.data.contributors_url, "?per_page=").concat(perPage);
                    allContributors = [];
                    page = 1;
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, axios.get("".concat(contributorsUrl, "&page=").concat(page), axiosConfig)];
                case 3:
                    contributorsResponse = _a.sent();
                    contributors = contributorsResponse.data;
                    if (contributors.length === 0) {
                        return [3 /*break*/, 4]; // No more contributors
                    }
                    allContributors = allContributors.concat(contributors);
                    page++;
                    linkHeader = contributorsResponse.headers.link;
                    if (!linkHeader || !linkHeader.includes('rel="next"')) {
                        return [3 /*break*/, 4]; // No more pages
                    }
                    return [3 /*break*/, 2];
                case 4: 
                // Return the total contributor count
                return [2 /*return*/, allContributors.length];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error fetching contributor count:', error_1);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getIssues(getUsername, repositoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var issuesUrl, allIssues, page, issuesResponse, issues, linkHeader, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    issuesUrl = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/issues?per_page=").concat(perPage);
                    allIssues = [];
                    page = 1;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, axios.get("".concat(issuesUrl, "&page=").concat(page))];
                case 2:
                    issuesResponse = _a.sent();
                    issues = issuesResponse.data;
                    if (issues.length === 0) {
                        return [3 /*break*/, 3]; // No more issues
                    }
                    allIssues = allIssues.concat(issues);
                    page++;
                    linkHeader = issuesResponse.headers.link;
                    if (!linkHeader || !linkHeader.includes('rel="next"')) {
                        return [3 /*break*/, 3]; // No more pages
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, allIssues];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error fetching issues:', error_2);
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getIssueCount(getUsername, repositoryName, axiosConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var issues, issueCount, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getIssues(getUsername, repositoryName)];
                case 1:
                    issues = _a.sent();
                    issueCount = issues.length;
                    return [2 /*return*/, issueCount];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching issue count:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getCommits(getUsername, repositoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var commitsUrl, allCommits, page, commitsResponse, commits, linkHeader, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    commitsUrl = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/commits?per_page=").concat(perPage);
                    allCommits = [];
                    page = 1;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, axios.get("".concat(commitsUrl, "&page=").concat(page))];
                case 2:
                    commitsResponse = _a.sent();
                    commits = commitsResponse.data;
                    if (commits.length === 0) {
                        return [3 /*break*/, 3]; // No more commits
                    }
                    allCommits = allCommits.concat(commits);
                    page++;
                    linkHeader = commitsResponse.headers.link;
                    if (!linkHeader || !linkHeader.includes('rel="next"')) {
                        return [3 /*break*/, 3]; // No more pages
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, allCommits];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error fetching commits:', error_4);
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getCommitsPerContributor(getUsername, repositoryName, axiosConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var commits, commitsPerContributor, commitCountsArray, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getCommits(getUsername, repositoryName)];
                case 1:
                    commits = _a.sent();
                    commitsPerContributor = commits.reduce(function (result, commit) {
                        var _a;
                        var contributor = ((_a = commit.author) === null || _a === void 0 ? void 0 : _a.login) || 'Unknown';
                        if (!result[contributor]) {
                            result[contributor] = 1;
                        }
                        else {
                            result[contributor]++;
                        }
                        return result;
                    }, {});
                    commitCountsArray = Object.values(commitsPerContributor);
                    // Return the array of commit counts
                    return [2 /*return*/, commitCountsArray];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error fetching commits per contributor:', error_5);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLatestCommit(getUsername, repositoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var commitsUrl, latestCommitResponse, latestCommit, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    commitsUrl = "https://api.github.com/repos/".concat(getUsername, "/").concat(repositoryName, "/commits?per_page=").concat(perPage1);
                    return [4 /*yield*/, axios.get(commitsUrl)];
                case 1:
                    latestCommitResponse = _a.sent();
                    latestCommit = latestCommitResponse.data[0];
                    return [2 /*return*/, latestCommit];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error fetching latest commit:', error_6);
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getTimeSinceLastCommit(getUsername, repositoryName, axiosConfig) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var latestCommit, lastCommitDate, currentDate, timeSinceLastCommitInMilliseconds, days, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getLatestCommit(getUsername, repositoryName)];
                case 1:
                    latestCommit = _b.sent();
                    if (!latestCommit) {
                        console.log('No commits found in the repository.');
                        return [2 /*return*/, 0]; // Return 0 days if there are no commits
                    }
                    lastCommitDate = new Date((_a = latestCommit.commit.author) === null || _a === void 0 ? void 0 : _a.date);
                    currentDate = new Date();
                    timeSinceLastCommitInMilliseconds = currentDate.getTime() - lastCommitDate.getTime();
                    days = Math.floor(timeSinceLastCommitInMilliseconds / (1000 * 60 * 60 * 24));
                    return [2 /*return*/, days]; // Return the number of days
                case 2:
                    error_7 = _b.sent();
                    console.error('Error calculating time since last commit:', error_7);
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractGitHubInfo(npmPackageUrl) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var githubUrlPattern, npmUrlPattern, npmUrlMatch, packageName, apiUrl, response, repositoryUrl, githubUrlMatch, username, repository, urlParts, username, repository, githubUrlMatch, username, repository, urlParts, username, repository, error_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    githubUrlPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/|$)/i;
                    if (!!githubUrlPattern.test(npmPackageUrl)) return [3 /*break*/, 2];
                    npmUrlPattern = /^https?:\/\/(www\.)?npmjs\.com\/package\/([^/]+)/i;
                    npmUrlMatch = npmPackageUrl.match(npmUrlPattern);
                    if (!npmUrlMatch || npmUrlMatch.length < 3) {
                        throw new Error('Invalid npm package URL.');
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
                            throw new Error('Unable to extract GitHub username and repository name from the repository URL.');
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
                            throw new Error('Unable to extract GitHub username and repository name from the repository URL.');
                        }
                    }
                    _c.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_8 = _c.sent();
                    console.error('Error extracting GitHub info:', error_8.message);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function cloneREPO(username, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var repoUrl, destinationPath, cloneCommand, _a, stdout, stderr, error_9;
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
                    error_9 = _b.sent();
                    console.error("Error cloning repository: ".concat(error_9.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getRepoLicense(username, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var response, license, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("https://api.github.com/repos/".concat(username, "/").concat(repoName))];
                case 1:
                    response = _a.sent();
                    if (response.data.license) {
                        license = response.data.license;
                        if (license.name) {
                            return [2 /*return*/, license.name];
                        }
                        else {
                            console.log('No license type found for this repository.');
                            return [2 /*return*/, null];
                        }
                    }
                    else {
                        console.log('No license information found for this repository. Continuing as Unlicensed.');
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    console.error("Error fetching repository information: ".concat(error_10.message));
                    return [2 /*return*/, null];
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
        console.error("Error reading file: ".concat(filePath), error);
        return 0; // Return 0 lines in case of an error
    }
}
function fetchGitHubInfo(npmPackageUrl, personalAccessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var githubInfo, headers, axiosConfig, days_since_last_commit, issue_count, total_contributors, contributor_commits, repolicense, rootDirectory, totalLines, total_lines, netscore, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    return [4 /*yield*/, extractGitHubInfo(npmPackageUrl)];
                case 1:
                    githubInfo = _a.sent();
                    if (!githubInfo) return [3 /*break*/, 10];
                    headers = {
                        Authorization: "Bearer ".concat(personalAccessToken)
                    };
                    axiosConfig = {
                        headers: headers
                    };
                    //gather info
                    return [4 /*yield*/, cloneREPO(githubInfo.username, githubInfo.repository)];
                case 2:
                    //gather info
                    _a.sent();
                    return [4 /*yield*/, getTimeSinceLastCommit(githubInfo.username, githubInfo.repository, axiosConfig)];
                case 3:
                    days_since_last_commit = _a.sent();
                    return [4 /*yield*/, getIssueCount(githubInfo.username, githubInfo.repository, axiosConfig)];
                case 4:
                    issue_count = _a.sent();
                    return [4 /*yield*/, getContributorsCount(githubInfo.username, githubInfo.repository, axiosConfig)];
                case 5:
                    total_contributors = _a.sent();
                    return [4 /*yield*/, getCommitsPerContributor(githubInfo.username, githubInfo.repository, axiosConfig)];
                case 6:
                    contributor_commits = _a.sent();
                    return [4 /*yield*/, getRepoLicense(githubInfo.username, githubInfo.repository)];
                case 7:
                    repolicense = _a.sent();
                    rootDirectory = "./cli_storage/".concat(githubInfo.repository);
                    return [4 /*yield*/, traverseDirectory(rootDirectory)];
                case 8:
                    totalLines = _a.sent();
                    total_lines = totalLines[1] - totalLines[0];
                    return [4 /*yield*/, (0, metrics_1.calculate_net_score)(contributor_commits, total_contributors, total_lines, issue_count, totalLines[0], repolicense, days_since_last_commit, npmPackageUrl)];
                case 9:
                    netscore = _a.sent();
                    fs.writeFileSync('output.ndjson', netscore + '\n', { flag: 'a' }); // 'a' flag appends data to the file
                    return [2 /*return*/, netscore];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_11 = _a.sent();
                    console.error('Error:', error_11.message);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.fetchGitHubInfo = fetchGitHubInfo;
