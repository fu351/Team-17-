
//Metric 1
export async function calculate_bus_factor(contributor_commits: number[]) {
    if (!contributor_commits) {
        return 0;
    }
    let key_contributor = 0;
    let total_contributors = contributor_commits.length;
    let bus_factor_min = 10;
    if (total_contributors == 0) {
        return 0;
    }
    else if (total_contributors < bus_factor_min) {
        bus_factor_min = total_contributors;
    }
    let  total_commits = 0;
    //find average num of commits per contributor
    for (let i = 0; i < total_contributors; i++) {
        total_commits += contributor_commits[i];
    }

    const avg = total_commits / total_contributors;
    const min_commit = avg;
    //find key contributor
    for (let i = 0; i < total_contributors; i++) {
        if (contributor_commits[i] >= min_commit) {
            key_contributor++;
        }
    }
    //if more than 20 key contributors, then the score is 1
    if ((key_contributor / bus_factor_min) >= 1) {
        return 1;
    }
    else {
        return key_contributor / bus_factor_min;
    }

}
//Metric 2
export async function calculate_correctness(lines_of_code: number, num_issues: number) {
    const correctness_percentage = lines_of_code / (num_issues * 50);
    if ( correctness_percentage >= 1) {
        return 1;
    }
    else {
        return correctness_percentage;
    }
}
//Metric 3
export async function calculate_ramp_up_time(lines_of_readme: number) {
    if (lines_of_readme > 200) {
        return 1;
    }
    else {
        return lines_of_readme / 200;
    }
}   
//Metric 4 calculates the license score and how freely we can use the code
export async function calculate_license(license_type:string | null) {
    if(license_type == null) {
        license_type = 'unlicense';
    }
    else {
        license_type = license_type.toLowerCase();
    }
    switch (license_type) {
        case "afl-3.0":
            return 0.8; //open-source, requires attribution and inclusion of license
        case "apache-2.0":
            return 0.7; //open-source, requires attribution and preservation and disclaimer
        case "artistic-2.0":
            return 0.8; //open-source, requires attribution and preservation 
        case "bsl-1.0":
            return 0.8; //open-source, requires attribution and preservation 
        case "bsd-2-clause":
            return 0.8; //open-source, requires attribution and preservation 
        case "bsd-3-clause":
            return 0.7; //open-source, requires attribution and preservation and disclaimer
        case "bsd-3-clause-clear":
            return 0.7; //open-source, requires attribution and preservation and disclaimer
        case "bsd-4-clause":
            return 0.6; //open-source, requires attribution, preservation, disclaimer and notification
        case "0bsd":
            return 1; // No restrictions
        case "cc0-1.0":
            return 1; // No restrictions
        case "cc-by-4.0":
            return 0.9; //open-source, requires attribution 
        case "cc-by-sa-4.0":
            return 0.8; //open-source, requires attribution and preservation 
        case "wtfpl":
            return 1; // Minimal restrictions
        case "ecl-2.0":
            return 0.8; //open-source, requires attribution and preservation 
        case "epl-1.0":
            return 0.8; //open-source, requires disclaimer and preservation 
        case "epl-2.0":
            return 0.8; //same as epl-1.0
        case "eupl-1.1":
            return 0.8; //open-source, requires attribution and preservation 
        case "agpl-3.0":
            return 0.9; //Requires that modified versions are made available to users of the software over a network.
        case "gpl-2.0":
            return 0.9; //Requires preservation of licesnse for derivative works
        case "gpl-3.0":
            return 0.9; //same as gpl-2.0
        case "lgpl-2.1":
            return 1; // Low restrictions
        case "lgpl-3.0":
            return 1; // same as lgpl-2.1
        case "isc":
            return 1; // Minimal restrictions
        case "lppl-1.3c":
            return 0.9; //open-source, requires attribution 
        case "ms-pl":
            return 0.9; //open-source, requires attribution 
        case "mit license":
            return 1; // Minimal restrictions
        case "mit":
            return 1;
        case "mpl-2.0":
            return 0.7 // Conditions on source code modifications and copyleft provisions
        case "osl-3.0":
            return 0.6; //open-source, requires attribution, preservation, disclaimer and copyleft
        case "postgresql":
            return 0.8; //open-source, requires attribution and disclaimers
        case "ofl-1.1":
            return 0.8; //open-source, requires attribution and preservation
        case "ncsa":
            return 0.7; //open-source, requires attribution, preservation and disclaimers
        case "unlicense":
            return 1;
        case "zlib":
            return 0.8; //open-source, requires attribution and disclaimers
        default:
            return 0;
    }
    
}
//Metric 5 calculates responsiveness based on time since last commit
export async function calculate_responsiveness(days_since_last_commit: number) {
    if (days_since_last_commit <= 7) { //within a week
        return 1;
    }
    else if (days_since_last_commit <= 14) { //within 2 weeks
        return 0.8;
    }
    else if (days_since_last_commit <= 30) { //within a month
        return 0.6;
    }
    else if (days_since_last_commit <= 60) { //within 2 months
        return 0.4;
    }
    else if (days_since_last_commit <= 180) { //within 6 months
        return 0.2;
    }
    else { // more than 6 months
        return 0;
    }
}
export async function calculate_dependencies(assigned_dependencies: number, unassigned_dependencies: number) {
    //If there are no unassigned dependencies, then the score is 1, this covers the case of if there are no dependencies too
    if (unassigned_dependencies == 0) {
        return 1;
    }
    const total_dependencies = assigned_dependencies + unassigned_dependencies;
    return (assigned_dependencies / total_dependencies);
}
//Net_Score
export async function calculate_net_score(contributor_commits: number[], lines_of_code: number, num_issues: number, lines_of_readme: number, license_type: string, days_since_last_commit: number, assigned_dependencies:number, unassigned_dependencies:number, reviewed_code:number, npmPackageUrl: string) {
    //console.log("lines",lines_of_code, num_issues);
    //console.log (lines_of_readme,contributor_commits,license_type);
    const bus_factor = await calculate_bus_factor(contributor_commits);
    const correctness = await calculate_correctness(lines_of_code, num_issues);
    const ramp_up_time = await calculate_ramp_up_time(lines_of_readme);
    const license = await calculate_license(license_type);
    const responsiveness = await calculate_responsiveness(days_since_last_commit);
    const dependencies = await calculate_dependencies(assigned_dependencies, unassigned_dependencies);
    const net_score = 0.25 * bus_factor + 1.25 * correctness + 1 * ramp_up_time + 0.5 * license + 2 * responsiveness + dependencies + reviewed_code;

    //return each const metric score and net score
    const  NET_SCORE: number = (Math.floor(net_score / 7 * 10000) / 10000); 
    const  RAMP_UP_SCORE: number = Math.floor(ramp_up_time * 10000) / 10000;
    const  CORRECTNESS_SCORE: number =  Math.floor(correctness * 10000) / 10000; 
    const  BUS_FACTOR_SCORE: number = Math.floor(bus_factor * 10000) / 10000;
    const  RESPONSIVE_MAINTAINER_SCORE: number = Math.floor(responsiveness * 10000) / 10000;
    const  LICENSE_SCORE: number = Math.floor(license * 10000) / 10000 ;
    const DEPENDENCY_SCORE: number = Math.floor(dependencies * 10000) / 10000;
    const REVIEWED_CODE_SCORE: number = Math.floor(reviewed_code * 10000) / 10000;
    const output = [npmPackageUrl,NET_SCORE, RAMP_UP_SCORE, CORRECTNESS_SCORE, BUS_FACTOR_SCORE, RESPONSIVE_MAINTAINER_SCORE, LICENSE_SCORE, DEPENDENCY_SCORE, REVIEWED_CODE_SCORE]
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
   

    return output;
}