import { v4 as uuidv4 } from 'uuid';
import Chart from 'chart.js/auto';

const POISSION_RATE = 12 * 60 * 1000; // 12 minutes
const POISON_DURATION = 10 * 60 * 1000; // 10 minutes
const TIME = 3 * 60 * 60 * 1000; // 3 hours
const computerCount = TIME / POISON_DURATION;

type Computer = {
  id: string;
  sequence: number;
  status: string;
  repair_time: number;
  real_time: number;
};

function createRandomComputers(
  compCount: number,
  poissionRate: number,
): Computer[] {
  const computers: Array<Computer> = [];
  let randomTime: number = 0;
  let real_time: number = 0;

  for (let i = 1; i <= compCount; i++) {
    // Generate random 1 - 12 minutes for each computer
    randomTime = Math.floor(Math.random() * poissionRate) + 1;
    real_time += POISON_DURATION;

    const computer = {
      id: uuidv4(),
      sequence: i,
      status: 'broken',
      repair_time: randomTime,
      real_time,
    };
    computers.push(computer);
  }

  return computers;
}

const computers: Array<Computer> = createRandomComputers(
  computerCount,
  POISSION_RATE,
);

function repairComputers(computers: Computer[]): Computer[] {
  const repairedComputers: Array<Computer> = [];

  computers.forEach((computer) => {
    if (computer.status === 'broken') {
      computer.status = 'repaired';
      computer.real_time -= computer.repair_time + POISON_DURATION;
    }
    repairedComputers.push(computer);
  });

  return repairedComputers;
}

const _computers = repairComputers(computers);

function drawChart(data: Array<Computer>): void {
  const chartElement = document.getElementById('myChart');

  if (!chartElement && !computers && Array.isArray(computers)) {
    process.exit();
  }
  const chartData = {
    labels: data.map((computer) => `${computer.sequence}.pc`),
    datasets: [
      {
        label: 'Benzetim ve Modeleme Odevi #2',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: data.map((computer) => computer.repair_time / 1000 / 60),
      },
    ],
  };

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  new Chart(chartElement, config);
}

drawChart(_computers);
