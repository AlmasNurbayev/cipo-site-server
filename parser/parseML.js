'use strict';

import { formatISO } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';
import convert from 'xml-js';
import dotenv from 'dotenv';
import _ from 'lodash';
import { findProperties } from './findProperties.js';
import { findRegistrator } from './findRegistrator.js';
import { findFolder } from './findFolder.js';
import { logger, writeLog } from '../utils/logger.js';
import { recordDB } from './recordDB.js';
import { findProduct } from './findProduct.js';
import { findDB } from './findDB.js';
import { findImages } from './findImages.js';
import { findPrices } from './findPrices.js';
import { findSizes } from './findSizes.js';
import { findOffer } from './findOffer.js';




dotenv.config();

/**
 * находим папку oldPath и переименовываем в папку с датой-временем
 * @function
 * @param {string} oldPath - путь/имя текущей папки
 * @return {string | undefined} возвращаем путь/имя новой папки или undefned если не получилось
 */
async function moveUpload(oldPath) {
    logger.info('parser/parseML.js - moveUpload ' + 'begin ' + oldPath);
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
 * парсим import0_1.xml и записываем все в базу
 * @function
 * @param {string} path - путь до файла без имени файла
 * @param {string} file - полный путь до файла
 * @param {number} user_id - id юзера, под которым пишется регистратор 
 */
async function parseImport(path, file, user_id) {
    logger.info('parser/parseML.js - parseImport ' + 'begin ' + file);
    const xml = await fs.readFile(file);
    let result = convert.xml2json(xml);
    let obj = JSON.parse(result);
    fs.writeFile(path + "/import0_1.json", result);

    logger.info('parser/parseML.js - parseImport ' + ' - obj_registrator');
    const obj_registrator = findRegistrator(obj, user_id, path, file);
    //console.log(obj_registrator);
    logger.info('parser/parseML.js - parseImport ' + ' record to DB - registrator');
    const res_record = {};
    res_record.registrator = await recordDB('object', 'registrator', obj_registrator);
    //console.log(res_record.registrator);


    logger.info('parser/parseML.js - parseImport ' + ' - obj_product_group');
    const obj_product_group = findProperties(obj, 'Свойства', 'ТоварнаяГруппа');
    await recordDB('array', 'product_group', obj_product_group, res_record.registrator.id);
    //console.log(obj_product_group);
            
    logger.info('parser/parseML.js - parseImport ' + ' - obj_product_vid');
    const obj_product_folder = findFolder(obj, 'Классификатор', 'Группы');
    await recordDB('array', 'product_folder', obj_product_folder, res_record.registrator.id);
    //console.log(obj_product_folder);

    // парсим и пишем таблицу товаров
    logger.info('parser/parseML.js - parseImport ' + ' - obj_product');
    const obj_product = await findProduct(obj, path, res_record.registrator.id);
    writeLog('products_parsing.txt',JSON.stringify(obj_product));
    const obj_product_without_images = JSON.parse(JSON.stringify(obj_product)); // создаем копию массива товаров и убираем картинки, т.к. их нет в таблице product
    obj_product_without_images.forEach(element => {
       delete element.images;    
    });

    const res_record_product = await recordDB('array', 'product', obj_product_without_images, res_record.registrator.id);
    writeLog('products_record.txt',JSON.stringify(res_record_product));

    // создаем объект для таблицы картинок и пишем в БД 
    const obj_images = await findImages(obj_product, res_record.registrator.id);
    const res_record_images = await recordDB('array', 'image_registry', obj_images, res_record.registrator.id);
}

/**
 * парсим offers0_1.xml и записываем в базу
 * @function
 * @param {string} path - путь до файла без имени файла
 * @param {string} file - полный путь до файла
 * @param {number} user_id - id юзера, под которым пишется регистратор
 */
async function parseOffers(path, file, user_id) {
    logger.info('parser/parseML.js - parseOffers ' + 'begin ' + file);
    const xml = await fs.readFile(file);
    let result = convert.xml2json(xml);
    let obj = JSON.parse(result);
    fs.writeFile(path + "/offers0_1.json", result);

    logger.info('parser/parseML.js - parseOffers ' + ' - obj_registrator');
    const obj_registrator = findRegistrator(obj, user_id, path, file);
    //console.log(obj_registrator);

    logger.info('parser/parseML.js - parseImport ' + ' record to DB - registrator');
    const res_record = {};
    res_record.registrator = await recordDB('object', 'registrator', obj_registrator);    

    logger.info('parser/parseML.js - parseOffers ' + ' - prices');
    const obj_prices = findPrices(obj, 'ПакетПредложений', 'ТипыЦен', res_record.registrator.id);
    await recordDB('array', 'price_vid', obj_prices, res_record.registrator.id);
    //console.log(obj_prices);

    logger.info('parser/parseML.js - parseOffers ' + ' - stores');
    const obj_stores = findFolder(obj, 'ПакетПредложений', 'Склады', res_record.registrator.id);
    await recordDB('array', 'store', obj_stores, res_record.registrator.id);
    //await recordDB('array', 'price_vid', obj_prices, res_record.registrator.id);
    //console.log(obj_stores);

    logger.info('parser/parseML.js - parseOffers ' + ' - size');
    const obj_sizes = findSizes(obj, 'Свойства', 'Размер2');
    await recordDB('array', 'size', obj_sizes, res_record.registrator.id);

    logger.info('parser/parseML.js - parseOffers ' + ' - offers');
    const obj_offers = await findOffer(obj);
    console.log(obj_offers);
    await recordDB('array', 'price_registry', obj_offers.price, res_record.registrator.id);
    await recordDB('array', 'qnt_registry', obj_offers.qnt, res_record.registrator.id);

    // 

}

async function main(user_id) {
    logger.info('parser/parseML.js - main ' + 'begin ');
    const newFolder = await moveUpload(process.env.mlRoute);
    if (newFolder === undefined) {
        logger.info('parser/parseML.js - main ' + 'moveUpload undefined');
        return;
    }
    await parseImport(newFolder, newFolder+'/import0_1.xml', user);
}
 
parseImport('uploads/webdata','uploads/webdata/import0_1.xml',4);
parseOffers('uploads/webdata','uploads/webdata/offers0_1.xml',4);






// читам import0_1.xml

