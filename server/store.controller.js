
import { logger } from '../utils/logger.js';
import { endTiming } from './prom/end_timing.js';
import { getStoreService } from './store.service.js';

export async function getStore(request, responce, next) {
    logger.info('server / store.controller.js - getStore receive query: ' + JSON.stringify(request.query));

    // let { news } = request.query;
    // // [ '31', ' 32' ] [ 1, 3 ] [ 4, 5 ] [ 10000, 50000 ]

    // if (news) {
    //     news = parseInt(news);
    // }

    const res = await getStoreService();
    
    if (res === null) {
         
        responce.status(400).send();   
        
    } else {
        
        responce.status(200).json(res);
        
    }

    
    logger.info('server / store.contrller.js - getStore ended');
}