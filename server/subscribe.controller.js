import { getSubscribeService, postSubscribeService } from "./subscribe.service.js";
import { logger } from "../utils/logger.js";
import { formatISO } from 'date-fns';
import { endTiming } from "./prom/end_timing.js";

export async function getSubscribes(request, responce, next) {
    logger.info('server / subscribe.controller.js - get receive: ' + request);

    const res = await getSubscribeService(request);

    if (res === null) {
        
        responce.status(400).send();
        //logger.info('server / subscribe.contrller.js - 400 getSubscribes ended');
    } else {
        
        responce.status(200).json(res);
        //logger.info('server / subscribe.contrller.js - 200 getSubscribes ended');
    }        
}


export async function postSubscribe(request, responce, next) {
    logger.info('server / subscribe.controller.js - postSubscribe receive: ' + request.body);

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    //console.log(request.body);

    if (JSON.stringify(request.body) === '{}') {
        
        responce.status(400).send('no body of request');
        //logger.info('server / subscribe.contrller.js - 400 postSubscribe ended');
    }

    let body = request.body;
    if (Object.hasOwn(body, 'agree')) {
        if (body.agree === 'true') { body.agree = true }
        if (body.agree === 'false') { body.agree = false }
    }
    if (Object.hasOwn(body, 'phone')) {
        if (body.phone === '') {
            body.phone = null;
        }
    }
    if (Object.hasOwn(body, 'email')) {
        if (body.email === '') {
            body.email = null;
        }
    }    
    body.create_date = currentDate;

    const res = await postSubscribeService(body);

    if (res === null) {
        
        responce.status(400).send();

        //logger.info('server / subscribe.contrller.js - 400 getStore ended');
    } else if (res.id) {
        
        responce.status(201).json(res);
        //logger.info('server / subscribe.contrller.js - 200 getStore ended');
    } else {
        if (res.includes('Unique constraint failed on the fields')) {
        
        responce.status(400).send('unique field error');
        //logger.info('server / subscribe.contrller.js - 400 getStore ended - unique field error');
        } else {
            
            responce.status(400).send();
            //logger.info('server / subscribe.contrller.js - 400 getStore ended');
        }

    }

}