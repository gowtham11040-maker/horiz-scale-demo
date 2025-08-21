// server.js
const cluster = require('cluster');
const os = require('os');

const WORKERS = Number(process.env.WORKERS || os.cpus().length);
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0'; // required by many hosts (listen on all interfaces)

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} starting ${WORKERS} workers…`);
  for (let i = 0; i < WORKERS; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new one…`);
    cluster.fork();
  });
} else {
  const express = require('express');
  const app = express();

  app.get('/', (_req, res) => {
    res.send(`Hello from worker PID ${process.pid}`);
  });

  // quick ID endpoint to show which worker handled you
  app.get('/whoami', (_req, res) => {
    res.json({ pid: process.pid, workerId: cluster.worker.id });
  });

  // tiny CPU demo to notice distribution across workers
  app.get('/heavy', (_req, res) => {
    const start = Date.now();
    while (Date.now() - start < 500) {} // ~0.5s busy work
    res.json({ pid: process.pid, tookMs: Date.now() - start });
  });

  app.get('/health', (_req, res) => res.send('ok'));

  app.listen(PORT, HOST, () => {
    console.log(`Worker ${process.pid} listening on http://${HOST}:${PORT}`);
  });
}
