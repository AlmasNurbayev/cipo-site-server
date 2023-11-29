
import { prismaI } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

/**
 * получаем из базы список магазинов, на базе реквизита operation_data
 * @function
 * @return {array} возвращаем массив объектов магазинов с реквизитами согласно схеме
 */

export async function getStoreService() {
    logger.info('server/store.service.js - getStoreService start');
    //console.log('get getStoreService');

//    if (!news || news === undefined) { news = 5 };

    try {
        let query = { // выбираем последние магазины по очереди создания
            orderBy: {
                id: 'desc',
            },
            where: {public: true}
        }
        let res = await prismaI.store.findMany(query);
        return res;
    } catch (error) {
        console.log('server/store.service.js - getStoreService ' + error.stack);
        logger.error('server/store.service.js - getStoreServiceervice ' + error.stack);
    }
}