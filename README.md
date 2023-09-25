
# A CLI for trustworthy module re-use
ECE461 Project: Team 17

## Project Description
This project involved building a command-line interface (CLI) to help evaluate the trustworthiness of open-source JavaScript modules for reuse. The CLI takes in a list of module URLs as input, evaluates various metrics related to module quality and maintainer responsiveness, and outputs an overall trustworthiness score along with subscores for each metric <br>

The project was completed in 5 phases over 5 weeks: <br>
Week 1: Planning and Design <br>
Weeks 2-4: Implementation, Validation, Delivery <br>
Week 5: Postmortem 

## Getting Started
- Step 1:
Run `chmod +x run` command
<br> The command "chmod +x run" is used to make the file "run" executable in Unix-like operating systems, including Linux and macOS.

- Step 2:
Run `./run install` command
<br> It install all the dependencies required to run the program on ECE server

- Step 3:
Run `./run URL_FILE` command
<br> It runs the "URL_FILE" of the program that has ASCII-coded values for URL that we are required to work on for calculating the metrics.

- Step 4:
Run `./run test` command
<br> It runs the test cases that cover 80% of our code

## Implementation Details
- Written in TypeScript
- Metrics calculated using data from GitHub API and local Git repository analysis
- Test suite contains 20 test cases covering 80% line coverage
- Uses `npm` for command line argument parsing

## Things to note
- API Limit <br>
Though this is not directly related to the I/O specification of the auto-grader, while we were doing our own testing we have been running into issues of exceeding the hourly request limit. This could cause the auto-grader to choke.
