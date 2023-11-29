'useStrict';

import express from "express";
//import { logger } from "../utils/logger.js";
import dotenv from 'dotenv';
import {initRouterApi} from "./router.js";
import cors from 'cors';
import fs from 'fs';
import https from 'https';
//import http from 'http';
import helmet from 'helmet';
import rateLimit, { MemoryStore } from 'express-rate-limit'
import client from 'prom-client'; 

dotenv.config();

const port = process.env.PORT_EXPRESS;
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
  register
});

const app = express();
app.use(cors());
app.use('/product_images',express.static('product_images'));
app.use('/news_images',express.static('news_images'));
app.use('/store_images',express.static('store_images'));
app.use(express.json());
app.use('/api', initRouterApi(), limiter);
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});
//app.use(limiter);
app.use(helmet());

const key = fs.readFileSync('./ssl/2023-11/private.key');
const cert = fs.readFileSync('./ssl/2023-11/certificate.crt');
const ca = fs.readFileSync('./ssl/2023-11/ca_bundle.crt');
const options = {
  key: key,
  cert: cert,
  ca: ca
};
const server = https.createServer(options, app);

 server.listen(port, () => {
   console.log("server starting on port : " + port)
 });

// app.listen(port, ()=> {
//     console.log('start express on port: ' + port);
//     logger.info('server / index.js started on port ' + port);
// })