import { v4 as uuidv4 } from 'uuid';
import { ChartItem } from 'chart.js';
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
  let real_time = 0;

  for (let i = 1; i <= compCount; i++) {
    // Generate random 1 - 12 minutes for each computer
    let randomTime = Math.floor(Math.random() * poissionRate) + 1;
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
  const fixedComputers = computers.map((computer, index) => {
    if (computer.repair_time > 0) {
      computer.real_time -= computer['repair_time'];
      return computer;
    }

    computer.status = 'healthy';
    return computer;
  });

  return fixedComputers;
}

const _computers = repairComputers(computers);
console.log(computers);

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
    type: 'line',
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
