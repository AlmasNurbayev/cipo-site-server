'use strict';

import { formatISO } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';
import convert from 'xml-js';
import dotenv from 'dotenv';
import _ from 'lodash';
import { findProperties } from './findProperties.js';
import { findRegistrator } from './findRegistrator.js';
import { findVid } from './findVid.js';
import { logger } from '../utils/logger.js';
import { recordDB } from './recordDB.js';

dotenv.config();

/**
 * находим папку oldPath и переименовываем в папку с датой-временем
 * @function
 * @param {string} oldPath - путь/имя текущей папки
 * @return {string | undefined} возвращаем путь/имя новой папки или undefned если не получилось
 */
async function moveUpload(oldPath) {
    logger.info('utils/parseML.js - moveUpload ' + 'begin ' + oldPath);
    const result = formatISO(Date.now(), { representation: 'complete' }).replaceAll(':', '-');
    const newFolderName = oldPath + '_' + result;
    try {
        await fs.rename(oldPath, newFolderName);
        logger.info('utils/parseML.js - moveUpload ' + 'end ' + newFolderName);
        return newFolderName;
    } catch (error) {
        logger.error('utils/parseML.js - moveUpload ' + error.stack);
        console.log('utils/parseML.js - moveUpload ' + error.stack);
        return undefined;
    }
}

/**
 * парсим import0_1.xml и возвращаем объект
 * @function
 * @param {string} path - путь до файла без имени файла
 * @param {string} file - полный путь до файла
 * @return {object | undefined} возвращаем объект с данными или undefned если не получилось
 */
async function parseImport(path, file, user_id) {
    logger.info('utils/parseML.js - parseImport ' + 'begin ' + file);
    const xml = await fs.readFile(file);
    let result = convert.xml2json(xml);
    let obj = JSON.parse(result);
    fs.writeFile(path + "/import0_1.json", result);

    logger.info('utils/parseML.js - parseImport ' + ' - obj_registrator');
    const obj_registrator = findRegistrator(obj, user_id, path, file);
    console.log(obj_registrator);

    logger.info('utils/parseML.js - parseImport ' + ' - obj_product_group');
    const obj_product_group = findProperties(obj, 'Свойства', 'ТоварнаяГруппа');
    console.log(obj_product_group);
            
    logger.info('utils/parseML.js - parseImport ' + ' - obj_product_vid');
    const obj_product_vid = findVid(obj, 'Классификатор', 'Группы');
    console.log(obj_product_vid);

    logger.info('utils/parseML.js - parseImport ' + ' record to DB - registrator');
    recordDB('object', 'registrator', obj_registrator);
    
    const obj_product = [];

    
}



async function main(user_id) {
    logger.info('utils/parseML.js - main ' + 'begin ');
    const newFolder = await moveUpload(process.env.mlRoute);
    if (newFolder === undefined) {
        logger.info('utils/parseML.js - main ' + 'moveUpload undefined');
        return;
    }
    await parseImport(newFolder, newFolder+'/import0_1.xml', user);
}
 
parseImport('uploads/webdata','uploads/webdata/import0_1.xml',1);






// читам import0_1.xml

