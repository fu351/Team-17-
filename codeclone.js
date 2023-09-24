"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
// Replace these values with the GitHub repository you want to clone
var repoUrl = 'https://github.com/dgtlmoon/changedetection.io.git';
var destinationPath = 'testPackage';
// Run the Git clone command
var cloneCommand = "git clone ".concat(repoUrl, " ").concat(destinationPath, " "); //
(0, child_process_1.exec)(cloneCommand, function (error, stdout, stderr) {
    if (error) {
        console.error("Error cloning repository:".concat(error.message)); // 
        return;
    }
    /*if (stderr) {
      console.error(`Git error: ${stderr}`);
      return;
    }*/
    console.log("Repository cloned to ".concat(destinationPath));
});
