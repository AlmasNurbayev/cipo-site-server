'useStrict';

import { prismaI } from '../utils/prisma.js'
import { logger } from '../utils/logger.js'
import { formatISO } from 'date-fns';


/**
 * записываем новые данные в таблицу БД
 * @function
 * @param {string} type - тип данных, одиночный объект (object) или массив (array)
 * @param {string} table - имя таблицы
 * @param {object} obj - объект с данными
 * @param {number} registratorID - ID регистратора, добавляется в запись в случае записи массива
 * @return {object | undefined} возвращает объект с количеством вставленных записей или undefined
 */
export async function recordDB(type, table, obj, registratorID) {
    logger.info('parser/recordDB.js - starting ' + type + ' / ' + table +  ' / registrator id: ' + registratorID);

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    if (type === 'object') {
        //console.log(obj);
        obj.create_date = currentDate;
        try {
            const res = await prismaI[table].create({
                data: obj
            }
            )
            logger.info('parser/recordDB.js - ended ' + JSON.stringify(res));
            return res;
        } catch (error) {
            logger.error(error.stack);
            console.log(error.stack);
        }
    }

    if (type === 'array') {
        if (Array.isArray(obj)) {

            obj.forEach(element => {
               element.create_date = currentDate; 
               element.registrator_id = registratorID;
            });

            try {
                const res = await prismaI[table].createMany({
                    data: obj,
                    skipDuplicates: true
                }
                )
                logger.info('parser/recordDB.js - ended ' + JSON.stringify(res));
                return res;
            } catch (error) {
                logger.error('parser/recordDB.js' + error.stack);
                console.log('parser/recordDB.js' + error.stack);
            }
        }
    }


}