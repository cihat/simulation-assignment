import type { Computer } from './types';
import randn_bm from './randomGaussianGenerator';
import { v4 as uuidv4 } from 'uuid';
import { POISON_DURATION, TIME } from './constans';

export default function createRandomComputers(compCount: number): Computer[] {
  const computers: Array<Computer> = [];
  let randomTime: number = 0;
  let arrival_time: number = 0;
  let finish_time: number = 0;
  let diff: number = 0,
    excessComputer: number = 0;

  for (let i = 1; i <= compCount; i++) {
    // Generate random 0 - 24 minutes for each computer with Normal Distribution With Min, Max, Skew(Gaussian bell curve)
    randomTime = randn_bm(0, 24, 1) * 60 * 1000;

    arrival_time += POISON_DURATION;
    finish_time = arrival_time + randomTime;

    const computer = {
      id: uuidv4(),
      sequence: i,
      status: 'broken',
      repair_time: randomTime,
      arrival_time,
      finish_time,
      start_time: 0,
    };
    computers.push(computer);
  }

  diff = computers[computers.length - 1].finish_time - TIME;
  excessComputer = Math.floor((diff / 60 / 1000) % 100);
  if (excessComputer >= 10) {
    excessComputer = 2;
  } else {
    excessComputer = 1;
  }
  for (let i = 0; i < excessComputer; i++) {
    computers.pop();
  }

  return computers;
}
