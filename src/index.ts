import { v4 as uuidv4 } from 'uuid';
import Chart from 'chart.js/auto';
import humanizeDuration from 'humanize-duration';

const POISSION_RATE = 12 * 60 * 1000; // 12 minutes
const POISON_DURATION = 10 * 60 * 1000; // 10 minutes
const TIME = 3 * 60 * 60 * 1000; // 3 hours
const computerCount = TIME / POISON_DURATION;

type Computer = {
  id: string;
  sequence: number;
  status: string;
  repair_time: number;
  arrival_time: number;
  finish_time: number;
  start_time: number;
};

function randn_bm(min: number, max: number, skew: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0)
    num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }

  return num;
}

function createRandomComputers(
  compCount: number,
  poissionRate: number,
): Computer[] {
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

const computers: Array<Computer> = createRandomComputers(
  computerCount,
  POISSION_RATE,
);

function repairComputers(computers: Computer[]): Computer[] {
  const repairedComputers: Array<Computer> = [];

  computers.forEach((computer, index, arr) => {
    let nextElement = arr[(index + 1) % arr.length];
    let currElement = arr[index];

    if (currElement.finish_time < nextElement?.arrival_time) {
      nextElement.start_time = currElement.finish_time;
    } else {
      nextElement.start_time = currElement?.arrival_time;
    }

    currElement.status = 'fixed';
    repairedComputers.push(computer);
  });

  repairedComputers[0].start_time = repairedComputers[0].arrival_time = 0;

  console.log(repairedComputers);

  return repairedComputers;
}

function drawChart(data: Array<Computer>): void {
  const chartElement: HTMLCanvasElement = document.getElementById(
    'myChart',
  ) as HTMLCanvasElement;

  if (!chartElement && !computers && Array.isArray(computers)) {
    process.exit();
  }
  const chartData = {
    labels: data.map((computer) => `${computer.sequence}.pc`),
    datasets: [
      {
        label: 'Baslangic ve Bitis Sureleri',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: data.map((computer) => {
          return [computer.start_time, computer.finish_time];
        }),
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
          ticks: {
            callback: function (value: number) {
              return `${humanizeDuration(value, { language: 'tr' })}`;
            },
          },
        },
      },
      plugins: {
        subtitle: {
          display: true,
          text: 'Benzetim ve Modeleme Odevi #2',
        },
      },
    },
  };

  new Chart(chartElement, config as any);
}

const _computers = repairComputers(computers);

drawChart(_computers);

const infosContainerSelector: HTMLElement = document.getElementById(
  'infos_container',
) as HTMLElement;
const getLastItem = _computers[_computers.length - 1];
const diff = getLastItem.finish_time - TIME;

infosContainerSelector.innerHTML = `
  <div class="info">
    <p>
      <div>
      <span>
        <strong>Ortalama Gelen Musteri Sayisi: </strong>
      </span>
        <strong>${_computers.length}</strong>
      </div>
      <span>
      <span>
        <strong>Ortalama Kuyruktaki Musteri Sayisi: </strong>
      </span>
        <strong>${
          _computers.filter((computer) => computer.status == 'broken').length
        }</strong>
      </span>
      <span>
      <div>
        <span>
          <strong>Sorunu tespit edilen bilgisayar sayisi: </strong>
        </span>
        <strong>${
          _computers.filter((computer) => computer.status == 'fixed').length
        }</strong>
      </span>
      </div>
      <div>
        <span>
          <strong>Asan Sure: </strong>
        </span>
      <strong>${humanizeDuration(diff, { language: 'tr' })}</strong>
    </span>
    </div>

    <div>
      <span>
        <strong>Toplan Gecen Sure: </strong>
      </span>
      <strong>${humanizeDuration(
        _computers[_computers.length - 1].finish_time,
        { language: 'tr' },
      )}</strong>
      </span>
    </div>


    </p>
  </div>
  
  `;
