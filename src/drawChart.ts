import humanizeDuration from 'humanize-duration';
import type { Computer } from './types';
import Chart from 'chart.js/auto';

export default function drawChart(data: Array<Computer>): void {
  const chartElement: HTMLCanvasElement = document.getElementById(
    'myChart',
  ) as HTMLCanvasElement;

  if (!chartElement && !data && Array.isArray(data)) {
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
