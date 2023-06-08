'use strict';

import { formatISO } from 'date-fns';
import fs from 'fs/promises';
import convert from 'xml-js';
import * as dotenv from 'dotenv'
import { findProperties } from './findProperties.js';
import { findRegistrator } from './findRegistrator.js';
import { findFolder } from './findFolder.js';
import { logger } from '../utils/logger.js';
import { recordDB } from './recordDB.js';
import { findProduct } from './findProduct.js';
import { findImages } from './findImages.js';
import { findPrices } from './findPrices.js';
import { findSizes } from './findSizes.js';
import { findOffer } from './findOffer.js';
//import { findOfferNP } from './findOfferNP.js';
import { updateDB } from './updateDB.js';
//import { findDB } from './findDB.js';
import { prismaI } from '../utils/prisma.js';




/**
 * находим папку oldPath и переименовываем в папку с датой-временем
 * @function
 * @param {string} oldPath - путь/имя текущей папки
 * @return {string | Error} возвращаем путь/имя новой папки или аварийно завершаем процесс
 */
async function moveUpload(oldPath) {
    logger.info('parser/parseML.js - moveUpload ' + 'begin ' + oldPath);
    console.log('parser/parseML.js - moveUpload ' + 'begin ' + oldPath);
    const result = formatISO(Date.now(), { representation: 'complete' }).replaceAll(':', '-');
    const newFolderName = oldPath + '_' + result;
    try {
        await fs.rename(oldPath, newFolderName);
        logger.info('parser/parseML.js - moveUpload ' + 'end ' + newFolderName);
        return newFolderName;
    } catch (error) {
        logger.error('parser/parseML.js - moveUpload ' + error.stack);
        console.log('parser/parseML.js - moveUpload ' + error.stack);
        return undefined;
    }
}

/**
 * находим папку с картинками (import_files) и копируем ее в корень проекта в папку product_images
 * @function
 * @param {string} oldPath - путь/имя текущей папки
 * @param {string} newPath - путь/имя текущей папки
 * @return {string | Error} возвращаем путь/имя новой папки или аварийно завершаем процесс
 */
async function copyImages(oldPath) {
    logger.info('parser/parseML.js - copyImages ' + 'begin ' + oldPath);
    console.log('parser/parseML.js - copyImages ' + 'begin ' + oldPath);
    //const result = formatISO(Date.now(), { representation: 'complete' }).replaceAll(':', '-');
    //const newFolderName = oldPath + '_' + result;
    try {
        await fs.cp(oldPath, 'product_images', { recursive: true });
        logger.info('parser/parseML.js - copyImages ' + 'end ' + oldPath + ' to folder: ' + 'product_images');
        return 'product_images';
    } catch (error) {
        logger.error('parser/parseML.js - copyImages ' + error.stack);
        console.log('parser/parseML.js - copyImages ' + error.stack);
        //throw Error;
        //return undefined;
    }
}

/**
 * парсим import0_1.xml и записываем все в базу
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций
 * @param {string} path - путь до файла без имени файла
 * @param {string} file - полный путь до файла
 * @param {number} user_id - id юзера, под которым пишется регистратор 
 */
async function parseImport(tx, path, file, user_id) {
    logger.info('parser/parseML.js - parseImport ' + 'begin ' + file);
    const xml = await fs.readFile(file);
    let result = convert.xml2json(xml);
    let obj = JSON.parse(result);
    //fs.writeFile(path + "/import0_1.json", result);

    logger.info('parser/parseML.js - parseImport ' + ' - obj_registrator');
    const obj_registrator = findRegistrator(obj, user_id, path, file);
    //console.log(obj_registrator);
    logger.info('parser/parseML.js - parseImport ' + ' record to DB - registrator');
    const res_record = {};
    res_record.registrator = await recordDB(tx, 'object', 'registrator', obj_registrator);
    //console.log(res_record.registrator);


    logger.info('parser/parseML.js - parseImport ' + ' - obj_product_group');
    const obj_product_group = await findProperties(tx, obj, 'Свойства', 'ТоварнаяГруппа');
    //writeLog('product_group.txt',JSON.stringify(obj_product_group));
    await recordDB(tx, 'array', 'product_group', obj_product_group.record, res_record.registrator.id);
    if (obj_product_group.update.length > 0) {
        for (const element of obj_product_group.update) {
            await updateDB(tx, 'object', 'product_group', element, { id_1c: element.id_1c }, res_record.registrator.id);
        }
    }

    logger.info('parser/parseML.js - parseImport ' + ' - obj_vid_modeli');
    const obj_vid_modeli = await findProperties(tx, obj, 'Свойства', 'ВидМодели');
    await recordDB(tx, 'array', 'vid_modeli', obj_vid_modeli.record, res_record.registrator.id);
    if (obj_vid_modeli.update.length > 0) {
        for (const element of obj_vid_modeli.update) {
            await updateDB(tx, 'object', 'vid_modeli', element, { id_1c: element.id_1c }, res_record.registrator.id);
        }
    }

    //console.log(obj_vid_modeli);

    // парсим и пишем таблицу товаров
    logger.info('parser/parseML.js - parseImport ' + ' - obj_product');
    let obj_product = await findProduct(tx, obj, res_record.registrator.id);
    //writeLog('products_parsing.txt', JSON.stringify(obj_product));

    const obj_product_without_images_rec = structuredClone(obj_product.record)
    //const obj_product_without_images_rec = JSON.parse(JSON.stringify(obj_product.record)); // создаем копию массива товаров и убираем картинки, т.к. их нет в таблице product
    obj_product_without_images_rec.forEach(element => {
        delete element.images;
    });
    await recordDB(tx, 'array', 'product', obj_product_without_images_rec, res_record.registrator.id);
    const obj_product_without_images_upd = JSON.parse(JSON.stringify(obj_product.update)); // создаем копию массива товаров и убираем картинки, т.к. их нет в таблице product
    if (obj_product_without_images_upd.length > 0) {
        for (const element of obj_product_without_images_upd) {
            delete element.images;
            await updateDB(tx, 'object', 'product', element, { id_1c: element.id_1c }, res_record.registrator.id);
        }
    }


    // создаем объект для таблицы картинок и пишем в БД 
    //obj_product = await findDB(tx, 'product', '', '', ''); // нужна уже записанная таблица продуктов из базы чтобы получить id их записей
    obj_product = obj_product.update.concat(obj_product.record); // соединяем 2 массива для записи и обновления 
    const obj_images = await findImages(tx, obj_product, res_record.registrator.id);
    //const res_record_images = await recordDB('array', 'image_registry', obj_images.record, res_record.registrator.id);
    await recordDB(tx, 'array', 'image_registry', obj_images.record, res_record.registrator.id);
    if (obj_images.update.length > 0) {
        for (const element of obj_images.update) {
            await updateDB(tx, 'object', 'image_registry', element, { name: element.name }, res_record.registrator.id);
        }
    }


    return;
}

/**
 * парсим offers0_1.xml и записываем в базу
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций
 * @param {string} path - путь до файла без имени файла
 * @param {string} file - полный путь до файла
 * @param {number} user_id - id юзера, под которым пишется регистратор
 */
async function parseOffers(tx, path, file, user_id) {
    logger.info('parser/parseML.js - parseOffers ' + 'begin ' + file);
    const xml = await fs.readFile(file);
    let result = convert.xml2json(xml);
    let obj = JSON.parse(result);
    //fs.writeFile(path + "/offers0_1.json", result);

    logger.info('parser/parseML.js - parseOffers ' + ' - obj_registrator');
    const obj_registrator = findRegistrator(obj, user_id, path, file);
    //console.log(obj_registrator);

    logger.info('parser/parseML.js - parseImport ' + ' record to DB - registrator');
    const res_record = {};
    res_record.registrator = await recordDB(tx, 'object', 'registrator', obj_registrator);

    console.log(res_record.registrator);
    logger.info('parser/parseML.js - parseOffers ' + ' - prices');
    const obj_prices = findPrices(obj, 'ПакетПредложений', 'ТипыЦен', res_record.registrator.id);
    await recordDB(tx, 'array', 'price_vid', obj_prices, res_record.registrator.id);
    //console.log(obj_prices);

    logger.info('parser/parseML.js - parseOffers ' + ' - stores');
    const obj_stores = findFolder(obj, 'ПакетПредложений', 'Склады', res_record.registrator.id);
    await recordDB(tx, 'array', 'store', obj_stores, res_record.registrator.id);
    //await recordDB('array', 'price_vid', obj_prices, res_record.registrator.id);
    //console.log(obj_stores);

    logger.info('parser/parseML.js - parseOffers ' + ' - size');
    const obj_sizes2 = findSizes(obj, 'Свойства', 'Размер2');
    await recordDB(tx, 'array', 'size', obj_sizes2, res_record.registrator.id);
    const obj_sizes3 = findSizes(obj, 'Свойства', 'Размер3');
    console.log(obj_sizes3);
    await recordDB(tx, 'array', 'size', obj_sizes3, res_record.registrator.id);    

    logger.info('parser/parseML.js - parseOffers ' + ' - offers');
    const obj_offers = await findOffer(tx, obj);
    //console.log(obj_offers);


        await recordDB(tx,'array', 'qnt_price_registry', obj_offers.qnt_price, res_record.registrator.id);

        //const obj_offersNP = await findOfferNP(tx, obj); - отлючено парсинг себестоимости, пока не используется
        //await recordDB(tx,'array', 'price_registry', obj_offersNP.price);

    return;
    // 

}

async function main(user_id) {

    dotenv.config();

    logger.info('parser/parseML.js - main ' + 'begin ');
    console.log('======== ' + new Date().toLocaleString("ru-RU"));

    const newFolder = await moveUpload(process.env.mlRoute);
    //const newFolder = process.env.mlRoute;

    if (newFolder === undefined) {
        logger.info('parser/parseML.js - main ' + 'moveUpload undefined');
        return;
    }
    await prismaI.$transaction(async (tx) => {
        await parseImport(tx, newFolder, newFolder + '/import0_1.xml', user_id);
        await parseOffers(tx, newFolder, newFolder + '/offers0_1.xml', user_id);
    }, 
    {
        maxWait: 6000, // default: 2000
        timeout: 40000, // default: 5000
      });
    await prismaI.$disconnect();
    await copyImages(newFolder + '/import_files');

    logger.info('parser/parseML.js - main ' + 'end ');
    return;
}

main(4);





// читам import0_1.xml

