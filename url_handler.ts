import axios from 'axios';
import * as fs from 'fs';

export async function handleNpmUrl(url: string) {
  console.log('Handling npm URL:', url);

  try {
    const response = await axios.get(url);

    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error fetching data from npm URL:', error);
  }
}

export function readLines(filePath: string): string[] {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const decodedURLs: string[] = [];

  const lines = fileContents.split('\n');
  for (const line of lines) {
    const asciiCodes = line.trim().split(' ').map(Number);
    const decodedText = asciiCodes.map(code => String.fromCharCode(code)).join('');
    decodedURLs.push(decodedText);
  }

  return decodedURLs;
}