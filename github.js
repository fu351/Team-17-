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
var _this = this;
var getRepoInfo = function (owner, repo, token) { return __awaiter(_this, void 0, void 0, function () {
    var baseURL, url, response, repositoryInfo, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseURL = 'https://api.github.com/repos';
                url = "".concat(baseURL, "/").concat(owner, "/").concat(repo, "/collaborators");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: "token ".concat(token),
                            'Content-Type': 'application/json',
                            'X-GitHub-Api-Version': '2022-11-28',
                            'since': '2023-01-3100:00:000'
                        }
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, response.json()];
            case 3:
                repositoryInfo = _a.sent();
                return [2 /*return*/, repositoryInfo];
            case 4:
                console.error("Error: Unable to fetch data from GitHub API. Status code: ".concat(response.status));
                return [2 /*return*/, null];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error("Error: ".concat(error_1.message));
                return [2 /*return*/, null];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getCommitInfo = function (owner, repo, token) { return __awaiter(_this, void 0, void 0, function () {
    var baseURL, url, response, repositoryInfo, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseURL = 'https://api.github.com/repos';
                url = "".concat(baseURL, "/").concat(owner, "/").concat(repo, "/commits");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, fetch(url, {
                        method: 'GET',
                        headers: {
                            Authorization: "token ".concat(token),
                            'Content-Type': 'application/json',
                            'X-GitHub-Api-Version': '2022-11-28',
                            'since': '2023-01-3100:00:000'
                        }
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 4];
                return [4 /*yield*/, response.json()];
            case 3:
                repositoryInfo = _a.sent();
                return [2 /*return*/, repositoryInfo];
            case 4:
                console.error("Error: Unable to fetch data from GitHub API. Status code: ".concat(response.status));
                return [2 /*return*/, null];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error("Error: ".concat(error_2.message));
                return [2 /*return*/, null];
            case 7: return [2 /*return*/];
        }
    });
}); };
function getTimeSinceCommit(commitDate) {
    var currentDate = new Date();
    var timeDifferenceInSeconds = Math.floor((currentDate.getTime() - commitDate.getTime()) / 1000);
    if (timeDifferenceInSeconds < 60) {
        return "".concat(timeDifferenceInSeconds, " seconds ago");
    }
    else if (timeDifferenceInSeconds < 3600) {
        var minutes = Math.floor(timeDifferenceInSeconds / 60);
        return "".concat(minutes, " minute").concat(minutes > 1 ? 's' : '', " ago");
    }
    else if (timeDifferenceInSeconds < 86400) {
        var hours = Math.floor(timeDifferenceInSeconds / 3600);
        return "".concat(hours, " hour").concat(hours > 1 ? 's' : '', " ago");
    }
    else {
        var days = Math.floor(timeDifferenceInSeconds / 86400);
        return "".concat(days, " day").concat(days > 1 ? 's' : '', " ago");
    }
}
var owner = 'fu351';
var repo = 'Team-17-';
var token = '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';
var allCommitsByCollaborators = [];
getRepoInfo(owner, repo, token)
    .then(function (collaboratorInfo) {
    if (collaboratorInfo) {
        // Collaborator Info
        var collaboratorNames_1 = collaboratorInfo.map(function (collaborator) { return collaborator.login; });
        var numberOfCollaborators = collaboratorInfo.length;
        console.log('Collaborator Names:', collaboratorNames_1);
        console.log('Number of Collaborators:', numberOfCollaborators);
        getCommitInfo(owner, repo, token)
            .then(function (commitInfo) {
            if (commitInfo) {
                console.log('All commits:', commitInfo.length);
                var _loop_1 = function (collaborator) {
                    var commitsByCollaborator = commitInfo.filter(function (commit) { var _a; return ((_a = commit.author) === null || _a === void 0 ? void 0 : _a.login) === collaborator; });
                    if (commitsByCollaborator) {
                        allCommitsByCollaborators.push(commitsByCollaborator.length);
                    }
                };
                // Commits per collaborator
                for (var _i = 0, collaboratorNames_2 = collaboratorNames_1; _i < collaboratorNames_2.length; _i++) {
                    var collaborator = collaboratorNames_2[_i];
                    _loop_1(collaborator);
                }
                console.log('Commits by Collaborators:', allCommitsByCollaborators);
                // Days since last commit
                var latestCommit = commitInfo[0];
                var latestCommitDate = new Date(latestCommit.commit.author.date);
                var timeSinceCommit = getTimeSinceCommit(latestCommitDate);
                console.log('Time Since Commit:', timeSinceCommit);
            }
        });
    }
})["catch"](function (error) {
    console.error("Error: ".concat(error));
});
