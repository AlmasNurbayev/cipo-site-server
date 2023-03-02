'useStrict';

import express from "express";
import { logger } from "../utils/logger.js";
import dotenv from 'dotenv';
import initRouter from "./router.js";

dotenv.config();

const port = process.env.PORT_EXPRESS;

const app = express();

app.use(express.json());
app.use('/api', initRouter());

app.listen(port, ()=> {
    console.log('start express on port: ' + port);
    logger.info('server / index.js started on port ' + port);
})