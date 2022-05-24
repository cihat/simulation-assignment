import type { Computer } from './types';

export default function repairComputers(computers: Computer[]): Computer[] {
  const repairedComputers: Array<Computer> = [];

  computers.forEach((computer, index, arr) => {
    let nextElement = arr[(index + 1) % arr.length];
    let currElement = arr[index];

    if (currElement.finish_time < nextElement?.arrival_time) {
      nextElement.start_time = currElement.finish_time;
    } else {
      nextElement.start_time = currElement?.arrival_time;
    }

    currElement.status = 'repaired';
    repairedComputers.push(computer);
  });

  repairedComputers[0].start_time = repairedComputers[0].arrival_time = 0;

  return repairedComputers;
}
