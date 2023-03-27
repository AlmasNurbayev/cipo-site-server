'useStrict';

import { prismaI } from '../utils/prisma.js'
import { logger } from '../utils/logger.js'

/**
 * получаем из БД массив строк из таблицы
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций
 * @param {string} table - имя таблицы
 * @param {string} field - имя поля, необязательно. Если не задано, вернет все строки
 * @param {string} value - значение поля, необязательно. Если не задано, вернет все строки
 * @param {object} select - объект со списком полей для вывода, вида {id_1c: true, name_1c: true}, необязательно. Если не задано, вернет все поля.
 * @return {object} возвращаем объект со свойствами
 */
export async function findDB(tx, table, field = '', value = '', select = '') {

    //logger.info('parser/findDB.js - starting ' + value + ' in field ' + field +  ' in table ' + table + ' select ' + select);
    let query;
    if (field !='' && value != '') {
        query = {
            where: {[field]: value}
        }
    } else {
        query = {};  
    }
    if (select != '') {
        query.select = select;
    }
    
    try {
        const res = await tx[table].findMany(query)
        //logger.info('parser/findDB.js - ended ');
        return res;
    } catch (error) {
        logger.error('parser/findDB.js' + error.stack);
        console.log(error.stack);
    }



}