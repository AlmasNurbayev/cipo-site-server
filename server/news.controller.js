
import { logger } from '../utils/logger.js';
import { getNewsService } from './news.service.js';

export async function getNews(request, responce) {
    logger.info('server / news.controller.js - getNews receive query: ' + JSON.stringify(request.query));

    let { news } = request.query;
    // [ '31', ' 32' ] [ 1, 3 ] [ 4, 5 ] [ 10000, 50000 ]

    if (news) {
        news = parseInt(news);
    }

    const res = await getNewsService(news);
    
    if (res === null) {
        responce.status(400).send();    
    } else {
        responce.status(200).json(res);
    }

    
    logger.info('server / news.contrller.js - getNews ended');
}