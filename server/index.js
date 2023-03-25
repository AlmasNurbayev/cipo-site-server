'useStrict';

import express from "express";
import { logger } from "../utils/logger.js";
import dotenv from 'dotenv';
import {initRouterApi, initRouterStatic} from "./router.js";
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import http from 'http';

dotenv.config();

const port = process.env.PORT_EXPRESS;

const app = express();
app.use(cors());
app.use('/product_images',express.static('product_images'));
app.use('/news_images',express.static('news_images'));
app.use('/store_images',express.static('store_images'));
app.use(express.json());
app.use('/api', initRouterApi());

let key = fs.readFileSync('./ssl/selfsigned.key');
let cert = fs.readFileSync('./ssl/selfsigned.crt');
let options = {
  key: key,
  cert: cert
};

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

// app.listen(port, ()=> {
//     console.log('start express on port: ' + port);
//     logger.info('server / index.js started on port ' + port);
// })