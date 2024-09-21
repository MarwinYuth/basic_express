import { bootstrap } from ".";
import * as fs from "node:fs";
import cluster from "node:cluster";
import os from "node:os";

const restartFile = `${process.cwd()}/tmp/restart`;
let workers: any = [];
const cpuCount = os.cpus().length;
console.log(`The total number of CPUs is ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);

if (cluster.isPrimary) {
  for (let i = 0; i < cpuCount; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.process.pid} has been killed`);
    console.log("Starting another worker");
    const newWorker = cluster.fork();
    workers = workers.filter((w: any) => w.id !== worker.id);
    workers.push(newWorker);
  });
} else {
  console.log(`Worker ${process.pid} started`);
  bootstrap();
}
const restartWorker = async () => {
  console.log(`Processing command restart`);
  const oldWorkers = [...workers];
  for (let i = 0; i < oldWorkers.length; i++) {
    const worker = oldWorkers[i];
    worker.kill("SIGTERM");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

fs.watchFile(restartFile, () => {
  restartWorker();
});

process.on("SIGTERM", () => {
  console.log(`Primary worker ${process.pid} exiting`);
  process.exit(0);
});
