'useStrict';

import express from 'express';
//import { logger } from "../utils/logger.js";
import dotenv from 'dotenv';
import { initRouterApi } from './router.js';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import http from 'http';
import helmet from 'helmet';
import rateLimit, { MemoryStore } from 'express-rate-limit';
//import registerPromClient from 'prom/register.js';
import client from 'prom-client';
import { endTiming } from './prom/end_timing.js';
import { startTiming } from './prom/start_timing.js';
import { formatISO } from 'date-fns';

dotenv.config();

console.log(
  formatISO(Date.now(), { representation: 'complete' }),
  'init server...'
);

const portHTTP = process.env.PORT_HTTP;
const portHTTPS = process.env.PORT_HTTPS;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50, // Limit each IP to  requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  store: new MemoryStore(),
});
const register = new client.Registry();
client.collectDefaultMetrics({
  app: 'node-application-monitoring-app',
  prefix: 'node_',
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register,
});
export const http_request_duration_milliseconds = new client.Histogram({
  name: 'myapp_http_request_duration_milliseconds',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'statusCode', 'originalUrl'],
  buckets: [1, 10, 50, 100, 200, 500, 1000],
});
register.registerMetric(http_request_duration_milliseconds);
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode', 'originalUrl'],
});
register.registerMetric(httpRequestCounter);

const app = express();
app.use(cors());
app.use(startTiming);
app.use((req, res, next) => {
  // для перехвата всех ответов в конце цепочки
  res.on('finish', () => endTiming(req, res, next));
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json());
app.use('/api', initRouterApi(), limiter);
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.use(limiter);

// const key = fs.readFileSync('./ssl/private.key');
// const cert = fs.readFileSync('./ssl/certificate.crt');
// const ca = fs.readFileSync('./ssl/ca_bundle.crt');
// const options = {
//   key: key,
//   cert: cert,
//   ca: ca,
// };

const serverHTTP = http.createServer(app);
// const serverHTTPS = https.createServer(options, app);

// serverHTTPS.listen(portHTTPS, () => {
//   console.log(
//     formatISO(Date.now(), { representation: 'complete' }),
//     `server HTTPS starting on port: ${portHTTPS}`
//   );
//   console.log(JSON.stringify(serverHTTPS.address()));
// });

serverHTTP.listen(portHTTP, '0.0.0.0', () => {
  console.log(
    formatISO(Date.now(), { representation: 'complete' }),
    `server HTTP for inside connections starting on port: ${portHTTP}`
  );
  console.log(JSON.stringify(serverHTTP.address()));
});

// app.listen(port, ()=> {
//     console.log('start express on port: ' + port);
//     logger.info('server / index.js started on port ' + port);
// })
