import { prismaI } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";


export async function postSubscribeService(body) {
    
    logger.info('server/subscribe.service.js - postSubscribeService start');
    //console.log('get getNewsService', news);    
    //console.log(body);
    try {
        const res = await prismaI.subscribe.create({
            data: body
        });
        return res;
    } catch (error) {
        console.log('server/subscribe.service.js - postSubscribeService ' + error.stack);
        logger.error('server/subscribe.service.js - postSubscribeService ' + error.stack);    
        return error.stack;    
    }
}
