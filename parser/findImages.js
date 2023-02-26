'useStrict';

import { findDB } from "./findDB.js";
import { formatISO } from 'date-fns';
import { logger, writeLog } from "../utils/logger.js";
import { recordDB } from "./recordDB.js";

/**
 * находим папку oldPath и переименовываем в папку с датой-временем
 * @function
 * @param {object} obj - объект продуктов со всеми полями, включая массив images
 * @param {number} registrator_id - номер регистратора, нужен для включения в объект для записи в таблицу
 * @return {object} возвращаем объект для записи в таблицу image_registry
 */
export async function findImages(obj, registrator_id) {
    const product_all = await findDB('product', '', '', ''); // нужна уже записанная таблица продуктов из базы чтобы получить id их записей
    writeLog('products_all.txt',JSON.stringify(product_all));

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    const res = [];
    //console.log(obj);
    for (const element of obj) { // цикл по товарам
        
        if (element.images != undefined) {
            
            const product_id = product_all.find(e => e.id_1c === element.id_1c); // находим сопоставимое id_1с продукта и по нему берем id продукта
            if (!product_id) {continue;} 
            element.images.forEach(element2 => {    // цикл по картинкам
                //console.log(element2.size);
                res.push({
                    product_id: product_id.id,
                    registrator_id: registrator_id,
                    operation_date: currentDate,
                    ...element2});
            })
        }
    };
    //console.log(res);
    return res;
    



}