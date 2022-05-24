import { computerCount } from './constans';
import type { Computer } from './types';
import drawChart from './drawChart';
import renderHTML from './renderHTML';
import createRandomComputers from './createRandomComputers';
import repairComputers from './repairComputers';

const computers: Array<Computer> = createRandomComputers(computerCount);
const _computers: Array<Computer> = repairComputers(computers);

drawChart(_computers);
renderHTML(_computers);
