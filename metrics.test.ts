import {   
  calculate_bus_factor, 
  calculate_correctness, 
  calculate_ramp_up_time, 
  calculate_license, 
  calculate_responsiveness, 
  calculate_net_score 
} from './metrics';

// Issues with [1,2]
describe('calculate_bus_factor', () => {
  it('should return 1 if there is only one contributor', async () => {
    const bus_factor = await calculate_bus_factor([1]);
    expect(bus_factor).toBe(1);
  });
  it('should return NaN (division by 0) if there are no contributors', async () => {
    const bus_factor = await calculate_bus_factor([]);
    expect(bus_factor).toBe(NaN);
  });
  it('should return 1 if there are two contributors with the same number of commits', async () => {
    const bus_factor = await calculate_bus_factor([1, 1]);
    expect(bus_factor).toBe(1);
  });
  it('should return 0.5 if there are two contributors with different number of commits', async () => {
    const bus_factor = await calculate_bus_factor([1, 3]);
    expect(bus_factor).toBe(0.5);
  });
  it('should return 0.75 if there are three contributors with the same number of commits', async () => {
    const bus_factor = await calculate_bus_factor([1, 1, 1]);
    expect(bus_factor).toBe(1);
  });
  it('should return 0.75 if there are three contributors with different number of commits', async () => {
    const bus_factor = await calculate_bus_factor([1, 2, 3]);
    expect(bus_factor).toBe(2/3);
  });
  it('should return 1 if there are four contributors with the same number of commits', async () => {
    const bus_factor = await calculate_bus_factor([1, 1, 1, 1]);
    expect(bus_factor).toBe(1);
  });
  it('should return 1 if there are four contributors with different number of commits', async () => {
    const bus_factor = await calculate_bus_factor([1, 2, 3, 5]);
    expect(bus_factor).toBe(0.5);
  });
  it('should correctly update min value', async () => {
    const bus_factor = await calculate_bus_factor([1, 2, 3, 5, 1]);
    expect(bus_factor).toBe(0.4);
  });
});

// num_issues can be 0????
describe('calculate_correctness', () => { 
  it('should return 1 if there are no issues', async () => {
    const correctness = await calculate_correctness(100, 0);
    expect(correctness).toBe(1);
  });
  it('should return 1 if there are 100 lines of code and 1 issue', async () => {
    const correctness = await calculate_correctness(100, 1);
    expect(correctness).toBe(1);
  });
  it('should return 0.5 if there are 100 lines of code and 2 issues', async () => {
    const correctness = await calculate_correctness(100, 2);
    expect(correctness).toBe(0.5);
  });
  it('should return 1 if there are 200 lines of code and 3 issue', async () => {
    const correctness = await calculate_correctness(200, 3);
    expect(correctness).toBe(2/3);
  });
  it('should return 0.01 if there are 1 lines of code and 1 issue', async () => {
    const correctness = await calculate_correctness(1, 1);
    expect(correctness).toBe(0.01);
  });
});

describe('calculate_ramp_up_time', () => {
  it('should return 1 if there are 200 lines of readme', async () => {
    const ramp_up_time = await calculate_ramp_up_time(200);
    expect(ramp_up_time).toBe(1);
  });
  it('should return 0.5 if there are 100 lines of readme', async () => {
    const ramp_up_time = await calculate_ramp_up_time(100);
    expect(ramp_up_time).toBe(0.5);
  });
  it('should return 0.01 if there are 2 lines of readme', async () => {
    const ramp_up_time = await calculate_ramp_up_time(2);
    expect(ramp_up_time).toBe(0.01);
  });
  it('should return 1 if there more than 200 lines of readme', async () => {
    const ramp_up_time = await calculate_ramp_up_time(1000);
    expect(ramp_up_time).toBe(1);
  });
});

describe('calculate_license', () => {
  it('should return 1 if license is MIT', async () => {
    const license = await calculate_license('MIT license');
    expect(license).toBe(1);
  });
  it('should return 1 if license is null', async () => {
    const license = await calculate_license(null);
    expect(license).toBe(1)
  });
  it('should return 0 if license is not listed', async () => {
    const license = await calculate_license('test license');
    expect(license).toBe(0)
  });
  it('should return 0.6 if license is bsd-4-clause', async () => {
    const license = await calculate_license('bsd-4-clause')
    expect(license).toBe(0.6)
  });
});

describe('calculate_responsiveness', () => {
  it('should return 1 if last commit was within 0 days', async () => {
    const responsiveness = await calculate_responsiveness(0);
    expect(responsiveness).toBe(1);
  });
  it('should return 1 if last commit was within 7 days', async () => {
    const responsiveness = await calculate_responsiveness(7);
    expect(responsiveness).toBe(1);
  });
  it('should return 0.8 if last commit was within 14 days', async () => {
    const responsiveness = await calculate_responsiveness(14);
    expect(responsiveness).toBe(0.8);
  });
  it('should return 0.6 if last commit was within 30 days', async () => {
    const responsiveness = await calculate_responsiveness(30);
    expect(responsiveness).toBe(0.6);
  });
  it('should return 0.4 if last commit was within 60 days', async () => {
    const responsiveness = await calculate_responsiveness(60);
    expect(responsiveness).toBe(0.4);
  });
  it('should return 0.2 if last commit was within 180 days', async () => {
    const responsiveness = await calculate_responsiveness(180);
    expect(responsiveness).toBe(0.2);
  });
  it('should return 0 if last commit was more than 180 days', async () => {
    const responsiveness = await calculate_responsiveness(181);
    expect(responsiveness).toBe(0);
  });
});

/* net score = 
0.25 * bus_factor + 
1.25 * correctness + 
1 * ramp_up_time + 
0.5 * license + 
2 * responsiveness
*/

describe('calculate_net_score', () => {
  // console.log(process.env.LOG_FILE)
  // it('should return 0', async () => {
  //   const net_score = await calculate_net_score([], 0, 0, 0, null, 0, '');
  //   expect(net_score).toBe(null);
  // });
  it('should return netscore of 0.05', async () => {
    const spy = jest.spyOn(console, 'log');
    const result = await calculate_net_score([1], 0, 1, 0, 'ree', 200, '');
    expect(result).toBe(1)
    expect(spy).toHaveBeenCalledWith('{"URL":"","NET_SCORE":0.05,"RAMP_UP_SCORE":0,"CORRECTNESS_SCORE":0,"BUS_FACTOR_SCORE":1,"RESPONSIVE_MAINTAINER_SCORE":0,"LICENSE_SCORE":0}');
  });
  // it('should return a netscore of ')
});