'useStrict';

import { prismaI } from '../utils/prisma.js'
import { logger } from '../utils/logger.js'
import { formatISO } from 'date-fns';

/**
 * обновляем записи в таблице БД
 * @function
 * @param {string} type - тип данных, одиночный объект (object) или массив (array)
 * @param {string} table - имя таблицы
 * @param {object} obj - объект с данными
 * @param {object | boolean} where - объект с ключами для сравнения или false если не нужно
 * @param {number} registratorID - ID регистратора, добавляется в запись в случае записи массива
 * @return {object | undefined} возвращает объект с кол-вом обновленных записей или undefined
 */
export async function updateDB(type, table, obj, where, registratorID) {
    logger.info('parser/updateDB.js - starting ' + type + ' / ' + table +  ' / registrator id: ' + registratorID);

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    if (type === 'object') {
        //console.log(obj);
        obj.changed_date = currentDate;
        try {
            let data = {
                data: obj
                };
            if (where != false) {
                data = {
                    where: where,
                    data: obj
                }}            
            const res = await prismaI[table].update(data)
            logger.info('parser/updateDB.js - ended ' + JSON.stringify(res));
            return res;
        } catch (error) {
            logger.error(error.stack);
            console.log(error.stack);
        }
    }

    if (type === 'array') {
        if (Array.isArray(obj)) {

            obj.forEach(element => {
               element.changed_date = currentDate; 
               element.registrator_id = registratorID;
            });

            try {
                let data = {
                    data: obj
                    };
                if (where != false) {
                    data = {
                        where: where,
                        data: obj,
                    }}
                const res = await prismaI[table].update(data)
                logger.info('parser/updateDB.js - ended ' + JSON.stringify(res));
                return res;
            } catch (error) {
                logger.error('parser/updateDB.js' + error.stack);
                console.log('parser/updateDB.js' + error.stack);
            }
        }
    }


}