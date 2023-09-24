import * as fs from 'fs';
import * as path from 'path';

function addLists(list1: number[], list2: number[]): number[] {
    // Check if both lists have the same length
    if (list1.length !== list2.length) {
      throw new Error("Lists must have the same length for element-wise addition.");
    }
  
    // Use the map function to add elements element-wise
    const resultList: number[] = list1.map((value, index) => value + list2[index]);
  
    return resultList;
  }

function traverseDirectory(dir: string) {
  const files = fs.readdirSync(dir); // Get all files and directories in the current directory
  //let readmeCount = 0;
  //let totalCount = 0;
  let count: number[] = [0, 0];
 
  for (const file of files) {
    const filePath = path.join(dir, file); // Get the full path of the file or directory
    const stats = fs.statSync(filePath); // Get file/directory stats

    if (stats.isDirectory()) {
      // If it's a directory, recursively traverse it
      count = addLists(count,traverseDirectory(filePath) );
      //{readmeCount, totalCount} += traverseDirectory(filePath);

    } else if (stats.isFile()) {
      // If it's a file, count the lines
      if(!(filePath.includes('.txt'))){  
        const fileLineCount = countLines(filePath);
        count[1] += fileLineCount;
        //console.log(`filename: ${filePath}`);
      }
      if(filePath.includes("README.md")){
        const fileLineCount = countLines(filePath);
        count[0] += fileLineCount;
        //console.log(`filename: ${filePath}`);
        //console.log(`readcount: ${readmeCount}`);
      }

    }
  }
  //console.log(`count: ${count}`);
  return count;
}

function countLines(filePath: string): number {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    return lines.length;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return 0; // Return 0 lines in case of an error
  }
}

// Start traversing from the root directory of your project
const rootDirectory = './testPackage'; // Update this with the path to your project's root directory
const totalLines = traverseDirectory(rootDirectory);
console.log(`README lines in the project: ${totalLines[0]}`);
console.log(`Total lines in the project: ${totalLines[1]-totalLines[0]}`);
