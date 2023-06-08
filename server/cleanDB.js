'useStrict';

import { prismaI } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";
import { formatISO } from 'date-fns';
import { addDays } from 'date-fns'
//import { addHours } from 'date-fns'
import * as dotenv from 'dotenv';

/**
 * Чистим из БД старые данные, настройки в ENV
 * @function
 */

async function cleanDB() {
    dotenv.config();
    console.log('======== ' + new Date().toLocaleString("ru-RU"));

    if (process.env.clean_qnt_price === 'true') {
        logger.info('server/cleanDB.js - starting cleaning qnt_price');

        const countDay = -process.env.clean_qnt_price_day;
        const backDate = formatISO(addDays(Date.now(),countDay), { representation: 'complete', format: 'extended'});
        console.log('clear data lower then ' + backDate);
        try {
            let query = { // данные старее 5 дней 
                select: {id:true},
                where: {
                    operation_date:{
                    lt: new Date(backDate)
                    },
                },
            }
            const res = await prismaI.qnt_price_registry.findMany(query);
            const res_map = res.map((e) => e.id);
            //console.log(res_map);

            let query2 = { // передаем id из предыдущего запроса
                where: {
                    id:{ in: res_map},
                },
            }            
            //console.log(query2);
            const res2 = await prismaI.qnt_price_registry.deleteMany(query2);
            console.log(res2);
            logger.info('server/cleanDB.js - end cleaning qnt_price ' + JSON.stringify(res2));
            await prismaI.$disconnect();
        } catch (error) {
            logger.error('server/cleanDB.js - ' + error.stack);
            console.log(error.stack);            
        }
    }

}

cleanDB();