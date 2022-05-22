import { v4 as uuidv4 } from "uuid";
import { line } from "d3-shape";

const POISSION_RATE = 12 * 60 * 1000; // 12 minutes
const POISON_DURATION = 10 * 60 * 1000; // 10 minutes
const TIME = 3 * 60 * 60 * 1000; // 3 hours

const POISON_DAMAGE = 1;
const computerCount = TIME / POISON_DURATION;
const poisonCount = computerCount * POISON_DAMAGE;

function createRandomComputers(compCount, poissionRate) {
  const computers = [];

  for (let i = 0; i <= compCount; i++) {
    // Generate random 1 - 12 minutes for each computer
    let randomTime = Math.floor(Math.random() * poissionRate) + 1;

    const computer = {
      id: uuidv4(),
      sequence: i,
      status: "healthy",
      time: randomTime,
    };
    computers.push(computer);
  }

  return computers;
}

const computers = createRandomComputers(computerCount, POISSION_RATE);
console.log(computers);

function drawChart() {
  return line()
    .x((d) => x(d.sequence))
    .y((d) => y(d.time));
}

// const imgContainer = document.getElementById("chart_container");
// const img = document.getElementById("chart");
// d3.select(img)
//   .append("path")
//   .attr("d", drawChart(computers))
//   .attr("stroke", "black");
