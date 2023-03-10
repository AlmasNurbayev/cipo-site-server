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
export async function findOffer(tx, obj) {
    const res = {};
    const res_price = [];
    const res_qnt = [];
    const res_qnt_price = [];
    const root = findNestedObj(obj, 'name', 'Предложения');
    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    if (root) {
        const product_all = await findDB(tx, 'product', '', '', '');
        const size_all = await findDB(tx, 'size', '', '', '');
        const price_vid_all = await findDB(tx, 'price_vid', '', '', '');
        const store_all = await findDB(tx, 'store', '', '', '');
        //console.log(size_all);

        for (const element of root.elements) { // цикл по предложениям
            let product_id_1c = undefined;
            let product_id = undefined;
            let product_group_id = undefined;
            let size_id = undefined;
            let artikul = undefined;
            let product_name = undefined;
            let size_name_1c = undefined;
            let price = [];
            let qnt = [];
            let qnt_price = [];
            let vid_modeli_id = undefined;
            //let price = 0;


            for (const element2 of element.elements) { // цикл по узлам

                let data = {};
                //qnt, operation_date, store_id, product_id, size_id
                if (element2.name === 'Ид') {
                    if (element2.elements[0].text) {
                        const product_id_1c_text = element2.elements[0].text.split('#')[0];
                        const product_id_1c_find = product_all.find(e => e.id_1c === product_id_1c_text);
                        if (product_id_1c_find) {
                            product_id_1c = product_id_1c_find.id_1c;
                            product_id = product_id_1c_find.id;
                            product_group_id = product_id_1c_find.product_group_id;
                            product_name = product_id_1c_find.name_1c;
                            vid_modeli_id = product_id_1c_find.vid_modeli_id;
                        }
                    }
                }

                if (element2.name === 'Артикул') {
                    if (element2.elements[0].text) {
                        artikul = element2.elements[0].text;
                    }
                }
                if (element2.name === 'ХарактеристикиТовара') {
                    if (element2.elements[0].elements[1].elements[0].text == 'Размер2') {
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
                        let price_vid = undefined;
                        let price_value = 0;
                        if (element3.name === 'Цена' && element3.elements[1].name === 'ИдТипаЦены') {
                            const price_text = element3.elements[1].elements[0].text;
                            const price_find = price_vid_all.find(e => e.id_1c === price_text);
                            if (price_find) {
                                if (price_find.active === false) { // нерозничные цены не нужны
                                   continue;     
                                }
                                price_vid = price_find;
                            } else continue
                        }
                        if (element3.name === 'Цена' || element3.elements[2].name === 'ЦенаЗаЕдиницу') {
                            const price_text2 = Number(element3.elements[2].elements[0].text)
                            if (price_text2 > 0) {
                                price_value = Number(element3.elements[2].elements[0].text);
                                //console.log(price_vid_id  + ' / ' +  price);
                            }
                            let data1 = {
                                operation_date: currentDate,
                                size_id: size_id,
                                product_id: product_id,
                                price_vid_id: price_vid.id,
                                //price_vid_name: price_vid.name_1c,
                                //price_vid: price_vid,
                                sum: price_value,
                            };
                            //data = data1;
                            res_price.push(data1);
                            price.push(data1);
                            //console.log(price);
                        }
                    }
                }
                if (element2.name === 'Склад') {
                    if (element2.attributes) {
                        let id;
                        if (element2.attributes.ИдСклада) {
                            const store_text = element2.attributes.ИдСклада;
                            const store_find = store_all.find(e => e.id_1c === store_text);
                            if (store_find) {
                                id = store_find.id;
                                let data2 = {
                                    operation_date: currentDate,
                                    size_id: size_id,
                                    product_id: product_id,
                                    store_id: id,
                                    vid_modeli_id: vid_modeli_id,
                                    //name: name,
                                    //ИдСклада: element2.attributes.ИдСклада,
                                    qnt: Number(element2.attributes.КоличествоНаСкладе),
                                };
                                Object.assign(data, res_price.at(-1), data2);
                                data.product_group_id = product_group_id;
                                data.size_name_1c = size_name_1c;
                                data.product_name = product_name;
                                res_qnt.push(data2);
                                qnt.push(data2);
                                res_qnt_price.push(data);
                                //console.log(qnt);                                
                            } 
                        }
 
                    }
                }
            }

            /// проверка проблем
            if (price && price.length > 1) {
                logger.error('parser/findOffer.js - many retail prices for ' + artikul);
                console.log('parser/findOffer.js - many retail prices for ' + artikul);
                throw Error;
            }
            // 
            if (!product_id) {
                logger.error('parser/findOffer.js - not found product ' + artikul);
                console.log('parser/findOffer.js - not found product ' + artikul);
                throw Error;
            }
            if (!size_id) {
                logger.error('parser/findOffer.js - not found size ' + artikul);
                console.log('parser/findOffer.js - not found size ' + artikul);
                throw Error;
            }
            if (qnt.length==0) {
                logger.error('parser/findOffer.js - not found qnt ' + artikul);
                console.log('parser/findOffer.js - not found qnt ' + artikul);
                throw Error;
            }            
            if (res_qnt_price.length==0) {
                logger.error('parser/findOffer.js - not found price ' + artikul);
                console.log('parser/findOffer.js - not found price ' + artikul);
                throw Error;
            }   

            // res_price.push(price);
            // res_qnt.push(qnt);

        }
    }
    
    //res.price = res_price;
    //res.qnt = res_qnt;
    res.qnt_price = res_qnt_price;
    writeLog('offers_res.txt', JSON.stringify(res_qnt_price));
    return(res);

}