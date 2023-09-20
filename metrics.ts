//Metric 1
function calculate_bus_factor(key_contributor: number, total_contributor: number) {
    return 1 * (key_contributor / total_contributor);
}
//Metric 2
function calculate_correctness(num_issues: number) {
    //make sure num_issues is smaller than 10
    if (num_issues > 10) {
        return 0;
    }
    else {
        return 1 - (num_issues / 10);
    }
}
//Metric 3
function calculate_ramp_up_time(lines_of_readme: number) {
    if lines_of_readme > 200 {
    
    }
}
//Metric 4 calculates the license score and how freely we can use the code
function license(license_type:string) {
    license_type = license_type.toLowerCase();
    switch (license_type) {
        case "mit":
            return 1;
        case "gpl":
            return 0.5;
        case "apache":
            return 0.75;
        case "bsd":
            return 0.25;
        case "gnu":
            return 0.5;
        case "mozilla":
            return 0.5;
        case "unlicense":
            return 1;
        case "eclipse":
            return 0.5;
        case "wtfpl":
            return 1;
        case "isc":
            return 0.75;
        case "artistic":
            return 0.5;
        case "cc0":
            return 1;
        case "zlib":
            return 0.75;
        case "bsl":
            return 0.75;
        case "mpl":
            return 0.75;
        case "lppl":
            return 0.75;
        case "cc-by":
            return 0.5;
        case "cc-by-sa":
            return 0.5;
        case "cc-by-nc":
            return 0.5;
        case "cc-by-nc-sa":
            return 0.5;
        case "cc-by-nd":
            return 0.5;
        case "cc-by-nc-nd":
            return 0.5;
        case "epl":
            return 0.5;
        case "agpl":
            return 0.5;
        case "lgpl":
            return 0.5;
        case "gplv2":
            return 0.5;
        case "gplv3":
            return 0.5;
        case "lgplv2.1":
            return 0.5;
        case "lgplv3":
            return 0.5;
        case "agplv3":
            return 0.5;
        default:
            return 0;
    }
}
//Metric 5
function calculate_responsiveness(num_issues: number, num_issues_closed: number) {
    return num_issues_closed / num_issues;
}
// Net_Score
function calculate_net_score() {
    var net_score = 0;
    const bus_factor = 0.25 * calculate_bus_factor(key_contributor, total_contributor);
    const correctness = 1.25 * calculate_correctness(num_issues);
    const ramp_up_time = 1 * calculate_ramp_up_time(lines_of_code, lines_of_readme);
    const license = 0.5 * license(license_type);
    const responsiveness = 2 * calculate_responsiveness(num_issues, num_issues_closed);
    net_score += bus_factor + correctness + ramp_up_time + license + responsiveness;
    return net_score;
}
