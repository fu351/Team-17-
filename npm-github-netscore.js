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
exports.extractGitHubInfo = exports.countLinesInFile = exports.readLines = exports.fetchGitHubInfo = void 0;
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
function getContributors(owner, repo, personalAccessToken) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, commitsPerContributor, _i, data_1, contributor, commitCountsArray, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://api.github.com/repos/".concat(owner, "/").concat(repo, "/contributors?per_page=100");
                    return [4 /*yield*/, fetch(url, {
                            headers: {
                                Authorization: "token ".concat(personalAccessToken)
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    commitsPerContributor = {};
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        contributor = data_1[_i];
                        //console.log(`User: ${contributor.login}, Contributions: ${contributor.contributions}`);
                        commitsPerContributor[contributor.login] = contributor.contributions;
                    }
                    delete commitsPerContributor['Unknown'];
                    commitCountsArray = Object.values(commitsPerContributor);
                    return [2 /*return*/, commitCountsArray];
                case 3:
                    error_1 = _a.sent();
                    //console.error('Error fetching commits per contributor:', error);
                    //throw error;
                    console.log(error_1);
                    logBasedOnVerbosity("No commits per contributor obtained", 1);
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
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
                    console.log(error_4);
                    //process.exit(1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.extractGitHubInfo = extractGitHubInfo;
function cloneREPO(username, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var repoUrl, deleteCommand, _a, stdout_1, stderr_1, destinationPath, cloneCommand, _b, stdout, stderr, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    repoUrl = "https://github.com/".concat(username, "/").concat(repository, ".git");
                    if (!fs.existsSync("cli_storage/".concat(repository))) return [3 /*break*/, 2];
                    deleteCommand = "rm -rf cli_storage/".concat(repository);
                    return [4 /*yield*/, exec(deleteCommand)];
                case 1:
                    _a = _c.sent(), stdout_1 = _a.stdout, stderr_1 = _a.stderr;
                    _c.label = 2;
                case 2:
                    destinationPath = "cli_storage/".concat(repository);
                    cloneCommand = "git clone ".concat(repoUrl, " ").concat(destinationPath);
                    return [4 /*yield*/, exec(cloneCommand)];
                case 3:
                    _b = _c.sent(), stdout = _b.stdout, stderr = _b.stderr;
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _c.sent();
                    logBasedOnVerbosity("Error cloning repository: ".concat(error_5.message), 2);
                    console.log(error_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
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
        console.log(error); //process.exit(1);
        return 0;
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
        var githubInfo, error_6, headers, axiosConfig, url, response, error_7, error_8, issue_count, contributor_commits, days_since_last_commit, repoLicense, code_review_score, totalLines, assigned_dependencies, unassigned_dependencies, rootDirectory, error_9, error_10, error_11, error_12, error_13, error_14, total_lines, total_dependencies, scores, error_15, popularity, error_16, scores, error_17;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 44, , 45]);
                    personalAccessToken = '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';
                    if (!(npmPackageUrl == "")) return [3 /*break*/, 1];
                    logBasedOnVerbosity("Empty line encountered", 1);
                    return [2 /*return*/, 0];
                case 1:
                    githubInfo = void 0;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, extractGitHubInfo(npmPackageUrl)];
                case 3:
                    githubInfo = _b.sent();
                    console.log("extracted github info", githubInfo);
                    return [3 /*break*/, 5];
                case 4:
                    error_6 = _b.sent();
                    console.error("Error extracting GitHub info:", error_6);
                    return [2 /*return*/];
                case 5:
                    if (!githubInfo) return [3 /*break*/, 41];
                    headers = {
                        Authorization: "Bearer ".concat(personalAccessToken)
                    };
                    axiosConfig = {
                        headers: headers
                    };
                    url = "https://api.github.com/repos/".concat(githubInfo.username, "/").concat(githubInfo.repository);
                    response = void 0;
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, axios.get(url, axiosConfig)];
                case 7:
                    response = _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_7 = _b.sent();
                    console.log("request error");
                    return [2 /*return*/];
                case 9:
                    //gather info
                    console.log("got response");
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, cloneREPO(githubInfo.username, githubInfo.repository)];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_8 = _b.sent();
                    console.log("clone Error", error_8);
                    return [2 /*return*/];
                case 13:
                    console.log("cloned repo");
                    issue_count = response.data.open_issues_count;
                    contributor_commits = void 0;
                    days_since_last_commit = void 0;
                    repoLicense = void 0;
                    code_review_score = void 0;
                    totalLines = void 0;
                    assigned_dependencies = void 0;
                    unassigned_dependencies = void 0;
                    rootDirectory = "./cli_storage/".concat(githubInfo.repository);
                    _b.label = 14;
                case 14:
                    _b.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, getContributors(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 15:
                    contributor_commits = (_b.sent());
                    return [3 /*break*/, 17];
                case 16:
                    error_9 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 17:
                    _b.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, getTimeSinceLastCommit(githubInfo.username, githubInfo.repository)];
                case 18:
                    days_since_last_commit = (_b.sent());
                    return [3 /*break*/, 20];
                case 19:
                    error_10 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 20:
                    _b.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, getRepoLicense(response.data.license)];
                case 21:
                    repoLicense = _b.sent();
                    return [3 /*break*/, 23];
                case 22:
                    error_11 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 23:
                    _b.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, getReviewedLines(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 24:
                    code_review_score = _b.sent();
                    return [3 /*break*/, 26];
                case 25:
                    error_12 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 26:
                    _b.trys.push([26, 28, , 29]);
                    return [4 /*yield*/, traverseDirectory(rootDirectory)];
                case 27:
                    totalLines = _b.sent();
                    return [3 /*break*/, 29];
                case 28:
                    error_13 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 29:
                    _b.trys.push([29, 31, , 32]);
                    return [4 /*yield*/, getDependencyData(githubInfo.username, githubInfo.repository, personalAccessToken)];
                case 30:
                    _a = (_b.sent()), assigned_dependencies = _a[0], unassigned_dependencies = _a[1];
                    return [3 /*break*/, 32];
                case 31:
                    error_14 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 32:
                    total_lines = totalLines[1] - totalLines[0];
                    total_dependencies = assigned_dependencies + unassigned_dependencies;
                    scores = void 0;
                    _b.label = 33;
                case 33:
                    _b.trys.push([33, 35, , 36]);
                    return [4 /*yield*/, (0, metrics_1.calculate_net_score)(contributor_commits, total_lines, issue_count, totalLines[0], repoLicense, days_since_last_commit, assigned_dependencies, unassigned_dependencies, code_review_score, npmPackageUrl)];
                case 34:
                    scores = _b.sent();
                    return [3 /*break*/, 36];
                case 35:
                    error_15 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 36:
                    popularity = void 0;
                    _b.label = 37;
                case 37:
                    _b.trys.push([37, 39, , 40]);
                    return [4 /*yield*/, (0, popularity_tracker_1.getPopularity)(response, total_dependencies)];
                case 38:
                    popularity = _b.sent();
                    return [3 /*break*/, 40];
                case 39:
                    error_16 = _b.sent();
                    console.log("error");
                    return [2 /*return*/];
                case 40:
                    popularity = Math.floor(popularity * 10000) / 10000;
                    scores.push(popularity);
                    console.log("completed");
                    return [2 /*return*/, scores];
                case 41: return [4 /*yield*/, (0, metrics_1.calculate_net_score)([0], 0, 0, 0, 'unlicense', 0, 0, 0, 0, npmPackageUrl)];
                case 42:
                    scores = _b.sent();
                    scores.push(0); //Adding a 0 popularity score
                    return [2 /*return*/, scores];
                case 43: return [3 /*break*/, 45];
                case 44:
                    error_17 = _b.sent();
                    logBasedOnVerbosity("Error: ".concat(error_17.stack), 2);
                    return [3 /*break*/, 45];
                case 45: return [2 /*return*/];
            }
        });
    });
}
exports.fetchGitHubInfo = fetchGitHubInfo;
