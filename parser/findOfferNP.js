'useStrict';

import { findNestedObj } from "./findProperties.js";
import { findDB } from "./findDB.js";
import { formatISO } from 'date-fns';
import { logger, writeLog } from "../utils/logger.js";

/**
 * парсим объект с предложениями и возвращаем массив объектов (предложений) для регистра цен и регистра остатков
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций
 * @param {string} obj - объект с товарами
 * @param {string} registrator_id - id текущего регистратора из таблицы регистраторов, нужен для записей в других таблицах
 * @return {object} возвращаем  объект с 2 массивами. Один из них для цен, второй - для остатков товаров
 */
export async function findOfferNP(tx, obj) {
    const res = {};
    const price_res = [];
    //const res_qnt = [];
    //const res_qnt_price = [];
    const root = findNestedObj(obj, 'name', 'Предложения');
    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    if (root) {
        const product_all = await findDB(tx, 'product', '', '', '');
        const size_all = await findDB(tx, 'size', '', '', '');
        const price_vid_all = await findDB(tx, 'price_vid', '', '', '');
        //console.log(size_all);

        for (const element of root.elements) { // цикл по предложениям
            //let sum = 0;
            //let operation_date;
            let product_name_1c = undefined;
            let product_artikul = undefined;
            let product_id_1c = undefined;
            let product_id = undefined;
            let size_id = undefined;
            let size_name_1c = undefined;
            let price_vid_name_1c = undefined;
            let price = [];

            for (const element2 of element.elements) { // цикл по узлам
                //console.log('=== ' + JSON.stringify(element2));


                if (element2.name === 'Ид') {
                    if (element2.elements[0].text) {

                        const product_id_1c_text = element2.elements[0].text.split('#')[0];
                        const product_id_1c_find = product_all.find(e => e.id_1c === product_id_1c_text);
                        if (product_id_1c_find) {
                            product_id_1c = product_id_1c_find.id_1c;
                            product_id = product_id_1c_find.id;
                            product_name_1c = product_id_1c_find.name_1c;
                            //product_artikul = product_id_1c_find.artikul;
                        } else {
                            console.log('не найден продукт ' + product_id_1c_text);
                            logger.error('parser/findOfferNP.js - not found product ' + product_id_1c_text);
                            continue;
                        }
                    }
                }

                if (element2.name === 'Артикул') {
                    if (element2.elements[0].text) {
                        product_artikul = element2.elements[0].text;
                        console.log('artikul', product_artikul);
                    }
                }
                if (element2.name === 'ХарактеристикиТовара') {
                    if (element2.elements[0].elements[1].elements[0].text == 'Размер2' || element2.elements[0].elements[1].elements[0].text == 'Размер3') {
                        const size_text = element2.elements[0].elements[2].elements[0].text;
                        const size_find = size_all.find(e => e.name_1c === size_text);
                        if (size_find) {
                            size_id = size_find.id;
                            size_name_1c = size_find.name_1c
                        }
                    }
                }
                if (element2.name === 'Цены') {
                    for (const element3 of element2.elements) {
                        let price_find = [];
                        let sum = 0;
                        if (element3.name === 'Цена' && element3.elements[1].name === 'ИдТипаЦены') {
                            const price_text = element3.elements[1].elements[0].text;
                            price_find = price_vid_all.filter(e => (e.id_1c === price_text && e.active === false));

                        }
                        if (price_find.length > 1) {
                            logger.error('parser/findOfferNP.js - many cost prices for ' + product_artikul);
                            console.log('parser/findOfferNP.js - many cost prices for ' + product_artikul);
                            console.log(JSON.stringify(price_find));
                            throw Error;
                        }                        
                        if (element3.name === 'Цена' && element3.elements[2].name === 'ЦенаЗаЕдиницу') {
                            const price_text2 = Number(element3.elements[2].elements[0].text)
                            if (price_text2 > 0) {
                                sum = Number(element3.elements[2].elements[0].text);
                                //console.log(price_vid_id  + ' / ' +  price);
                            }
                            if (price_find.length >= 1) {
                                console.log(price_find);
                                let data1 = {
                                    sum: sum,
                                    operation_date: currentDate,
                                    product_name_1c: product_name_1c,
                                    product_artikul: product_artikul,
                                    product_id_1c: product_id_1c,
                                    product_id: product_id,
                                    size_id: size_id,
                                    size_name_1c: size_name_1c,
                                    price_vid_name_1c: price_find[0].name_1c
                                };
                                //data = data1;
                                price_res.push(data1);
                            };
                            //price.push(data1);
                            //console.log(price);
                        }
                    }

                }

            }

            /// проверка проблем

            // 
            if (!product_id) {
                logger.error('parser/findOfferNP.js - not found product ' + product_artikul);
                console.log('parser/findOfferNP.js - not found product ' + product_artikul);
                throw Error;
            }
            if (!size_id) {
                logger.error('parser/findOfferNP.js - not found size ' + product_artikul);
                console.log('parser/findOfferNP.js - not found size ' + product_artikul);
                throw Error;
            }


            // res_price.push(price);
            // res_qnt.push(qnt);

        }
    }

    //res.price = res_price;
    //res.qnt = res_qnt;
    res.price = price_res;
    writeLog('offersNP_res.txt', JSON.stringify(price_res));
    return (res);

}