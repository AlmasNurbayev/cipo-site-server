'useStrict';

import { findDB } from "./findDB.js";
import { formatISO } from 'date-fns';
import { logger, writeLog } from "../utils/logger.js";
import { recordDB } from "./recordDB.js";

/**
 * получаем объект продуктов, вытаскиваем из него подобъекты images, сопоставляем продукт из базы
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций* 
 * @param {object} obj - объект продуктов со всеми полями, включая массив images
  * @return {object} возвращаем объект с 2-мя массивами (record) для записи в таблицу image_registry и для обновления сущствующих записей (update)
 */
export async function findImages(tx, obj) {
    const product_all = await findDB(tx, 'product', '', '', ''); // нужна уже записанная таблица продуктов из базы чтобы получить id их записей
    const image_registry_all = await findDB(tx, 'image_registry', '', '', ''); // для проверки дублей

    writeLog('products_all.txt',JSON.stringify(product_all));

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    const res = [];
    const res_update = [];
    for (const element of obj) { // цикл по товарам
        if (element.images != undefined) {
            
            const product_id = product_all.find(e => e.id_1c === element.id_1c); // находим сопоставимое id_1с продукта и по нему берем id продукта
            //console.log(product_id);
            if (!product_id) {continue;} 
            for (const element2  of element.images) {    // цикл по картинкам
                 const compare = image_registry_all.find(e => e.name === element2.name)  // ищем в базе такое же имя картинки
                if (compare) { // в случае совпадения - передаем в другой массив обновления
                    res_update.push({
                        product_id: product_id.id,
                        operation_date: currentDate,
                        ...element2                        
                    })
                    continue;
                }
                res.push({
                    product_id: product_id.id,
                    operation_date: currentDate,
                    ...element2});
            }
        }
    };
    //console.log(res);
    writeLog('images_res.txt', JSON.stringify(res));
    writeLog('images_updates.txt', JSON.stringify(res_update));
    return  {
         record: res,
         update: res_update
     };
 }