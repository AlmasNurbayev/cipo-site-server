import { postSubscribeService } from "./subscribe.service.js";
import { logger } from "../utils/logger.js";

export async function postSubscribe(request, responce) {
    logger.info('server / subscrive.controller.js - post receive: ' + JSON.stringify(request.body));

    console.log(request.body);

    const res = await postSubscribeService(request.body);
    
    if (res === null) {
        responce.status(400).send();    
        logger.info('server / store.contrller.js - 400 getStore ended');
    } else {
        responce.status(201).json(res);
        logger.info('server / store.contrller.js - 200 getStore ended');
    }

}