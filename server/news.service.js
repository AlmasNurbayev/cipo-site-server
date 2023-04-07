
import { prismaI } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

/**
 * получаем из базы новые новости, на базе реквизита operation_data
 * @function
 * @param {number} news - кол-во последних новостей
 * @return {array} возвращаем массив объектов новостей с реквизитами согласно схеме
 */

export async function getNewsService(news) {
    logger.info('server/news.service.js - getNewsService start');
    console.log('get getNewsService', news);

    if (!news || news === undefined) { news = 5 }

    try {
        let query = { // выбираем последние новости по дате создания
            orderBy: {
                operation_date: 'desc',
            },
            take: news
        }
        let res = await prismaI.news.findMany(query);
        return res;
    } catch (error) {
        console.log('server/news.service.js - getNewsService ' + error.stack);
        logger.error('server/news.service.js - getNewsService ' + error.stack);
    }
}