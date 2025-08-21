// server.js
const cluster = require('cluster');
const os = require('os');

const WORKERS = Number(process.env.WORKERS || os.cpus().length);
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';

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

    app.get('/', (_req, res) => res.send(`Hello from worker PID ${process.pid}`));
    app.get('/whoami', (_req, res) => res.json({ pid: process.pid, workerId: cluster.worker.id }));

    app.listen(PORT, HOST, () => {
        console.log(`Worker ${process.pid} listening on http://${HOST}:${PORT}`);
    });
}
