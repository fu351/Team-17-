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
exports.getPopularity = void 0;
function getPopularity(response, dependents_count) {
    return __awaiter(this, void 0, void 0, function () {
        var stars_count, forks_count, download_count, _i, _a, release, _b, _c, asset, download_score, stars_score, forks_score, dependents_score, popularity;
        return __generator(this, function (_d) {
            stars_count = response.data.stargazers_count;
            forks_count = response.data.forks_count;
            download_count = 0;
            if (response.data.releases) {
                for (_i = 0, _a = response.data.releases; _i < _a.length; _i++) {
                    release = _a[_i];
                    if (release.assets) {
                        for (_b = 0, _c = release.assets; _b < _c.length; _b++) {
                            asset = _c[_b];
                            download_count += asset.download_count;
                        }
                    }
                }
            }
            download_score = 0;
            stars_score = 0;
            forks_score = 0;
            dependents_score = 0;
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
            popularity = download_score / 4 + stars_score / 4 + forks_score / 4 + dependents_score / 4;
            return [2 /*return*/, popularity];
        });
    });
}
exports.getPopularity = getPopularity;
