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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculate_net_score = exports.calculate_dependencies = exports.calculate_responsiveness = exports.calculate_license = exports.calculate_ramp_up_time = exports.calculate_correctness = exports.calculate_bus_factor = void 0;
//Metric 1
function calculate_bus_factor(contributor_commits) {
    return __awaiter(this, void 0, void 0, function () {
        var key_contributor, total_contributors, bus_factor_min, total_commits, i, avg, min_commit, i;
        return __generator(this, function (_a) {
            if (!contributor_commits) {
                return [2 /*return*/, 0];
            }
            key_contributor = 0;
            total_contributors = contributor_commits.length;
            bus_factor_min = 10;
            if (total_contributors == 0) {
                return [2 /*return*/, 0];
            }
            else if (total_contributors < bus_factor_min) {
                bus_factor_min = total_contributors;
            }
            total_commits = 0;
            //find average num of commits per contributor
            for (i = 0; i < total_contributors; i++) {
                total_commits += contributor_commits[i];
            }
            avg = total_commits / total_contributors;
            min_commit = avg;
            //find key contributor
            for (i = 0; i < total_contributors; i++) {
                if (contributor_commits[i] >= min_commit) {
                    key_contributor++;
                }
            }
            //if more than 20 key contributors, then the score is 1
            if ((key_contributor / bus_factor_min) >= 1) {
                return [2 /*return*/, 1];
            }
            else {
                return [2 /*return*/, key_contributor / bus_factor_min];
            }
            return [2 /*return*/];
        });
    });
}
exports.calculate_bus_factor = calculate_bus_factor;
//Metric 2
function calculate_correctness(lines_of_code, num_issues) {
    return __awaiter(this, void 0, void 0, function () {
        var correctness_percentage;
        return __generator(this, function (_a) {
            correctness_percentage = lines_of_code / (num_issues * 50);
            if (correctness_percentage >= 1) {
                return [2 /*return*/, 1];
            }
            else {
                return [2 /*return*/, correctness_percentage];
            }
            return [2 /*return*/];
        });
    });
}
exports.calculate_correctness = calculate_correctness;
//Metric 3
function calculate_ramp_up_time(lines_of_readme) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (lines_of_readme > 200) {
                return [2 /*return*/, 1];
            }
            else {
                return [2 /*return*/, lines_of_readme / 200];
            }
            return [2 /*return*/];
        });
    });
}
exports.calculate_ramp_up_time = calculate_ramp_up_time;
//Metric 4 calculates the license score and how freely we can use the code
function calculate_license(license_type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (license_type == null) {
                license_type = 'unlicense';
            }
            else {
                license_type = license_type.toLowerCase();
            }
            switch (license_type) {
                case "afl-3.0":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and inclusion of license
                case "apache-2.0":
                    return [2 /*return*/, 0.7]; //open-source, requires attribution and preservation and disclaimer
                case "artistic-2.0":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation 
                case "bsl-1.0":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation 
                case "bsd-2-clause":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation 
                case "bsd-3-clause":
                    return [2 /*return*/, 0.7]; //open-source, requires attribution and preservation and disclaimer
                case "bsd-3-clause-clear":
                    return [2 /*return*/, 0.7]; //open-source, requires attribution and preservation and disclaimer
                case "bsd-4-clause":
                    return [2 /*return*/, 0.6]; //open-source, requires attribution, preservation, disclaimer and notification
                case "0bsd":
                    return [2 /*return*/, 1]; // No restrictions
                case "cc0-1.0":
                    return [2 /*return*/, 1]; // No restrictions
                case "cc-by-4.0":
                    return [2 /*return*/, 0.9]; //open-source, requires attribution 
                case "cc-by-sa-4.0":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation 
                case "wtfpl":
                    return [2 /*return*/, 1]; // Minimal restrictions
                case "ecl-2.0":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation 
                case "epl-1.0":
                    return [2 /*return*/, 0.8]; //open-source, requires disclaimer and preservation 
                case "epl-2.0":
                    return [2 /*return*/, 0.8]; //same as epl-1.0
                case "eupl-1.1":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation 
                case "agpl-3.0":
                    return [2 /*return*/, 0.9]; //Requires that modified versions are made available to users of the software over a network.
                case "gpl-2.0":
                    return [2 /*return*/, 0.9]; //Requires preservation of licesnse for derivative works
                case "gpl-3.0":
                    return [2 /*return*/, 0.9]; //same as gpl-2.0
                case "lgpl-2.1":
                    return [2 /*return*/, 1]; // Low restrictions
                case "lgpl-3.0":
                    return [2 /*return*/, 1]; // same as lgpl-2.1
                case "isc":
                    return [2 /*return*/, 1]; // Minimal restrictions
                case "lppl-1.3c":
                    return [2 /*return*/, 0.9]; //open-source, requires attribution 
                case "ms-pl":
                    return [2 /*return*/, 0.9]; //open-source, requires attribution 
                case "mit license":
                    return [2 /*return*/, 1]; // Minimal restrictions
                case "mit":
                    return [2 /*return*/, 1];
                case "mpl-2.0":
                    return [2 /*return*/, 0.7]; // Conditions on source code modifications and copyleft provisions
                case "osl-3.0":
                    return [2 /*return*/, 0.6]; //open-source, requires attribution, preservation, disclaimer and copyleft
                case "postgresql":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and disclaimers
                case "ofl-1.1":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and preservation
                case "ncsa":
                    return [2 /*return*/, 0.7]; //open-source, requires attribution, preservation and disclaimers
                case "unlicense":
                    return [2 /*return*/, 1];
                case "zlib":
                    return [2 /*return*/, 0.8]; //open-source, requires attribution and disclaimers
                default:
                    return [2 /*return*/, 0];
            }
            return [2 /*return*/];
        });
    });
}
exports.calculate_license = calculate_license;
//Metric 5 calculates responsiveness based on time since last commit
function calculate_responsiveness(days_since_last_commit) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (days_since_last_commit <= 7) { //within a week
                return [2 /*return*/, 1];
            }
            else if (days_since_last_commit <= 14) { //within 2 weeks
                return [2 /*return*/, 0.8];
            }
            else if (days_since_last_commit <= 30) { //within a month
                return [2 /*return*/, 0.6];
            }
            else if (days_since_last_commit <= 60) { //within 2 months
                return [2 /*return*/, 0.4];
            }
            else if (days_since_last_commit <= 180) { //within 6 months
                return [2 /*return*/, 0.2];
            }
            else { // more than 6 months
                return [2 /*return*/, 0];
            }
            return [2 /*return*/];
        });
    });
}
exports.calculate_responsiveness = calculate_responsiveness;
function calculate_dependencies(assigned_dependencies, unassigned_dependencies) {
    return __awaiter(this, void 0, void 0, function () {
        var total_dependencies;
        return __generator(this, function (_a) {
            //If there are no unassigned dependencies, then the score is 1, this covers the case of if there are no dependencies too
            if (unassigned_dependencies == 0) {
                return [2 /*return*/, 1];
            }
            total_dependencies = assigned_dependencies + unassigned_dependencies;
            return [2 /*return*/, (assigned_dependencies / total_dependencies)];
        });
    });
}
exports.calculate_dependencies = calculate_dependencies;
//Net_Score
function calculate_net_score(contributor_commits, lines_of_code, num_issues, lines_of_readme, license_type, days_since_last_commit, assigned_dependencies, unassigned_dependencies, reviewed_code, npmPackageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var bus_factor, correctness, ramp_up_time, license, responsiveness, dependencies, net_score, NET_SCORE, RAMP_UP_SCORE, CORRECTNESS_SCORE, BUS_FACTOR_SCORE, RESPONSIVE_MAINTAINER_SCORE, LICENSE_SCORE, DEPENDENCY_SCORE, REVIEWED_CODE_SCORE, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculate_bus_factor(contributor_commits)];
                case 1:
                    bus_factor = _a.sent();
                    return [4 /*yield*/, calculate_correctness(lines_of_code, num_issues)];
                case 2:
                    correctness = _a.sent();
                    return [4 /*yield*/, calculate_ramp_up_time(lines_of_readme)];
                case 3:
                    ramp_up_time = _a.sent();
                    return [4 /*yield*/, calculate_license(license_type)];
                case 4:
                    license = _a.sent();
                    return [4 /*yield*/, calculate_responsiveness(days_since_last_commit)];
                case 5:
                    responsiveness = _a.sent();
                    return [4 /*yield*/, calculate_dependencies(assigned_dependencies, unassigned_dependencies)];
                case 6:
                    dependencies = _a.sent();
                    net_score = 0.25 * bus_factor + 1.25 * correctness + 1 * ramp_up_time + 0.5 * license + 2 * responsiveness + dependencies + reviewed_code;
                    NET_SCORE = (Math.floor(net_score / 7 * 10000) / 10000);
                    RAMP_UP_SCORE = Math.floor(ramp_up_time * 10000) / 10000;
                    CORRECTNESS_SCORE = Math.floor(correctness * 10000) / 10000;
                    BUS_FACTOR_SCORE = Math.floor(bus_factor * 10000) / 10000;
                    RESPONSIVE_MAINTAINER_SCORE = Math.floor(responsiveness * 10000) / 10000;
                    LICENSE_SCORE = Math.floor(license * 10000) / 10000;
                    DEPENDENCY_SCORE = Math.floor(dependencies * 10000) / 10000;
                    REVIEWED_CODE_SCORE = Math.floor(reviewed_code * 10000) / 10000;
                    output = [npmPackageUrl, NET_SCORE, RAMP_UP_SCORE, CORRECTNESS_SCORE, BUS_FACTOR_SCORE, RESPONSIVE_MAINTAINER_SCORE, LICENSE_SCORE, DEPENDENCY_SCORE, REVIEWED_CODE_SCORE];
                    /*const output = JSON.stringify({
                        URL: npmPackageUrl,
                        NET_SCORE: NET_SCORE,
                        RAMP_UP_SCORE: RAMP_UP_SCORE,
                        CORRECTNESS_SCORE: CORRECTNESS_SCORE,
                        BUS_FACTOR_SCORE: BUS_FACTOR_SCORE,
                        RESPONSIVE_MAINTAINER_SCORE: RESPONSIVE_MAINTAINER_SCORE,
                        LICENSE_SCORE: LICENSE_SCORE,
                        DEPENDENCY_SCORE: DEPENDENCY_SCORE,
                        REVIEWED_CODE_SCORE: REVIEWED_CODE_SCORE
                      });*/
                    return [2 /*return*/, output];
            }
        });
    });
}
exports.calculate_net_score = calculate_net_score;
