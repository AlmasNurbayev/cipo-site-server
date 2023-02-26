'useStrict';

import { findNestedObj } from "./findProperties.js";
import { findDB } from "./findDB.js";
import { formatISO } from 'date-fns';
import { logger, writeLog } from "../utils/logger.js";

/**
 * парсим объект с предложениями и возвращаем массив объектов (предложений) для регистра цен и регистра остатков
 * @function
 * @param {string} obj - объект с товарами
 * @param {string} registrator_id - id текущего регистратора из таблицы регистраторов, нужен для записей в других таблицах
 * @return {array} возвращаем массив объектов (товаров) с реквизитами. Внутри по 1 объекту на каждый товар
 */
export async function findOffer(obj, registrator_id) {
    const res = [];
    const root = findNestedObj(obj, 'name', 'Предложения');
    

    if (root) {
        const product_all = await findDB('product', '', '', '');    
        for (const element of root.elements) { // цикл по предложениям
            for (const element2 of element.elements) { // цикл по узлам
                //qnt, operation_date, store_id, product_id, size_id
                if (element2.name === 'Артикул') {
                    if (element2.elements[0].text) {
                        const artikul = element2.elements[0].text;
                        const artikul_find = product_all.find(e => e.artikul === artikul);
                        if (artikul_find) {
                            console.log(artikul_find);
                        }
                        
                    }
                }

                


            };    
        };    
    };


}
