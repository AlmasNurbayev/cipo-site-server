'use strict';

import { formatISO } from 'date-fns';
import fs from 'fs/promises';
import convert from 'xml-js';
import * as dotenv from 'dotenv'

import { logger, writeLog } from '../utils/logger.js';
import { recordDB } from './recordDB.js';

import { findOfferNP } from './findOfferNP.js';
import { updateDB } from './updateDB.js';
import { findDB } from './findDB.js';
import { prismaI } from '../utils/prisma.js';

/**
 * парсим offers0_1.xml с полным содержанием и записываем в регистр себестоимости = price_registry
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций
 * @param {string} path - путь до файла без имени файла
 * @param {string} file - полный путь до файла
 * @param {number} user_id - id юзера, под которым пишется регистратор
 */
async function parseOffers(tx, path, file, user_id) {
    logger.info('parser/parseNP.js - parseOffers ' + 'begin ' + file);
    const xml = await fs.readFile(file);
    let result = convert.xml2json(xml);
    let obj = JSON.parse(result);
    fs.writeFile(path + "/offers0_1.json", result);

    // logger.info('parser/parseNP.js - parseOffers ' + ' - obj_registrator');
    // const obj_registrator = findRegistrator(obj, user_id, path, file);
    // //console.log(obj_registrator);

    // logger.info('parser/parseNP.js - parseImport ' + ' record to DB - registrator');
    // const res_record = {};
    // res_record.registrator = await recordDB(tx, 'object', 'registrator', obj_registrator);

    // logger.info('parser/parseNP.js - parseOffers ' + ' - prices');
    // const obj_prices = findPrices(obj, 'ПакетПредложений', 'ТипыЦен', res_record.registrator.id);
    // await recordDB(tx, 'array', 'price_vid', obj_prices, res_record.registrator.id);


    // logger.info('parser/parseNP.js - parseOffers ' + ' - stores');
    // const obj_stores = findFolder(obj, 'ПакетПредложений', 'Склады', res_record.registrator.id);
    // await recordDB(tx, 'array', 'store', obj_stores, res_record.registrator.id);

    // logger.info('parser/parseNP.js - parseOffers ' + ' - size');
    // const obj_sizes = findSizes(obj, 'Свойства', 'Размер2');
    // await recordDB(tx, 'array', 'size', obj_sizes, res_record.registrator.id);

    logger.info('parser/parseNP.js - parseOffers ' + ' - offers');
    const obj_offers = await findOfferNP(tx, obj);

            await recordDB(tx,'array', 'price_registry', obj_offers.price);

    return;
    // 

}



/**
 * находим папку oldPath и переименовываем в папку с датой-временем
 * @function
 * @param {string} oldPath - путь/имя текущей папки
 * @return {string | Error} возвращаем путь/имя новой папки или аварийно завершаем процесс
 */
async function moveUpload(oldPath) {
    logger.info('parser/parseNP.js - moveUpload ' + 'begin ' + oldPath);
    console.log('parser/parseNP.js - moveUpload ' + 'begin ' + oldPath);
    const result = formatISO(Date.now(), { representation: 'complete' }).replaceAll(':', '-');
    const newFolderName = oldPath + '_NP_' + result;
    try {
        await fs.rename(oldPath, newFolderName);
        logger.info('parser/parseNP.js - moveUpload ' + 'end ' + newFolderName);
        return newFolderName;
    } catch (error) {
        logger.error('parser/parseNP.js - moveUpload ' + error.stack);
        console.log('parser/parseNP.js - moveUpload ' + error.stack);
        return undefined;
    }
}


async function main(user_id) {

    dotenv.config();

    logger.info('parser/parseNP.js - main ' + 'begin ');

    //const newFolder = await moveUpload(process.env.npRoute); 
    const newFolder = process.env.npRoute; // временно - не перемещаем файл

    if (newFolder === undefined) {
        logger.info('parser/parseNP.js - main ' + 'moveUpload undefined');
        return;
    }
    await prismaI.$transaction(async (tx) => {
        //await parseImport(tx, newFolder, newFolder + '/import0_1.xml', user_id);
        await parseOffers(tx, newFolder, newFolder + '/offers0_1.xml', user_id);
    });
    await prismaI.$disconnect();
    
    logger.info('parser/parseNP.js - main ' + 'end ');
    return;
}

main(4);