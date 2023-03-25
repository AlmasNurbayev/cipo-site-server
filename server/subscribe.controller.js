import { postSubscribeService } from "./subscribe.service.js";
import { logger } from "../utils/logger.js";
import { formatISO } from 'date-fns';

export async function postSubscribe(request, responce) {
    logger.info('server / subscrive.controller.js - post receive: ' + request.body);

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    //console.log(request.body);

    if (JSON.stringify(request.body) === '{}') {
        responce.status(400).send('no body of request');
        logger.info('server / store.contrller.js - 400 getStore ended');
    }

    let body = request.body;
    if (body.hasOwnProperty('agree')) {
        if (body.agree === 'true') { body.agree = true }
        if (body.agree === 'false') { body.agree = false }
    }
    if (body.hasOwnProperty('phone')) {
        if (body.phone === '') {
            body.phone = null;
        }
    }
    if (body.hasOwnProperty('email')) {
        if (body.email === '') {
            body.email = null;
        }
    }    
    body.create_date = currentDate;

    const res = await postSubscribeService(body);

    if (res === null) {
        responce.status(400).send();
        logger.info('server / store.contrller.js - 400 getStore ended');
    } else if (res.id) {
        responce.status(201).json(res);
        logger.info('server / store.contrller.js - 200 getStore ended');
    } else {
        if (res.includes('Unique constraint failed on the fields')) {
        responce.status(400).send('unique field error');
        logger.info('server / store.contrller.js - 400 getStore ended - unique field error');
        } else {
            responce.status(400).send();
            logger.info('server / store.contrller.js - 400 getStore ended');
        }

    }

}