"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
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
    var files = fs.readdirSync(dir); // Get all files and directories in the current directory
    //let readmeCount = 0;
    //let totalCount = 0;
    var count = [0, 0];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = path.join(dir, file); // Get the full path of the file or directory
        var stats = fs.statSync(filePath); // Get file/directory stats
        if (stats.isDirectory()) {
            // If it's a directory, recursively traverse it
            count = addLists(count, traverseDirectory(filePath));
            //{readmeCount, totalCount} += traverseDirectory(filePath);
        }
        else if (stats.isFile()) {
            // If it's a file, count the lines
            if (!(filePath.includes('.txt'))) {
                var fileLineCount = countLines(filePath);
                count[1] += fileLineCount;
                //console.log(`filename: ${filePath}`);
            }
            if (filePath.includes("README.md")) {
                var fileLineCount = countLines(filePath);
                count[0] += fileLineCount;
                //console.log(`filename: ${filePath}`);
                //console.log(`readcount: ${readmeCount}`);
            }
        }
    }
    //console.log(`count: ${count}`);
    return count;
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
// Start traversing from the root directory of your project
var rootDirectory = './tesst'; // Update this with the path to your project's root directory
var totalLines = traverseDirectory(rootDirectory);
console.log("README lines in the project: ".concat(totalLines[0]));
console.log("Total lines in the project: ".concat(totalLines[1] - totalLines[0]));
