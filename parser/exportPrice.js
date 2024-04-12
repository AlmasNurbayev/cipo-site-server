'useStrict';

import { prismaI } from '../utils/prisma.js';
import builder from 'xmlbuilder';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';

/**
 * вытаскиваем из БД из таблицы qnt_price_registry последние остатки товаров и цены
 * записываем в XML
 * @function
 */
export async function exportPrice() {
  dotenv.config();
  const registrator_id = await getLastRegistrator();
  console.log(' ==== start - export prices from DB to XML', new Date().toLocaleString("ru-RU"));
  console.log('last registrator_id', registrator_id);

  const data_array = await prismaI
  .$queryRaw`SELECT q.product_name, q.product_id, q.registrator_id , to_json(stores.agg) as stores, p.artikul , q.size_name_1c, sum, sum(qnt) as qnt 
  FROM qnt_price_registry AS q
JOIN product as p ON p.id = product_id
JOIN lateral (select (array_agg( jsonb_build_object('id', store.id, 'name_1c', store.name_1c, 'store_kaspi_id', store.store_kaspi_id))) 
		AS agg FROM store WHERE store.id = store_id) AS stores ON true
WHERE qnt > 0 AND sum > 0 AND q.registrator_id = ${registrator_id} AND p.public_web = true
GROUP BY q.product_name, q.product_id, p.artikul , stores.agg, q.registrator_id, q.size_name_1c, sum`

  console.log('count data from qnt_price_registry of DB: ', data_array.length);

  const rootXml = builder
    .create('kaspi_catalog', {
      encoding: 'utf-8',
    })
    .att({
      date: 'string',
      xmlns: 'kaspiShopping',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'kaspiShopping http://kaspi.kz/kaspishopping.xsd',
    })
    .ele('company', process.env.kaspi_merchant_name)
    .up()
    .ele('merchantid', process.env.kaspi_merchant_id)
    .up()
    .ele('offers');

  for (const element of data_array) {
    const array_availabilities = [];
    if (element.stores.length > 0) {
      for (const store of element.stores) {
        array_availabilities.push({
          '@available': element.qnt > 0 ? 'yes' : 'no',
          '@storeId': store.store_kaspi_id,
        });
        //rootXml.importDocument(person);
      }
    }

    rootXml
      .ele('offer', {
        sku: element.artikul + '-' + element.size_name_1c,
      })
      .ele({
        model: element.product_name,
        brand: element.product_name.split(' ')[0],
        price: element.sum,
      })
      .up()
      .ele('availabilities')
      .ele({ availability: array_availabilities });

    rootXml.up(); // закрытие availabilities
    rootXml.up(); // закрытие offer
  }

  //rootXml.up(); // закрытие offers

  const readyXml = rootXml.end({ pretty: true });
  const fullName = 'shared_price/last_price.xml';
  await fs.writeFile(fullName, readyXml);
  console.log(' success - export prices from DB to file:', fullName);
  console.log(' ==== end - export prices');
 

}

/**
 * получаем из базы последний номер регистратора, с которым в регистре есть остатки и цены
 * @function
 * @return {number} возвращаем id регистратора
 */
async function getLastRegistrator() {
  //logger.info('server/product.service.js - getLastRegistrator start');
  let registrator_id = undefined;

  try {
    const res = await prismaI.qnt_price_registry.groupBy({
      by: ['registrator_id'],
      _sum: {
        qnt: true,
        sum: true,
      },
      orderBy: {
        registrator_id: 'desc',
      },
    });
    if (res.length > 0) {
      for (const element of res) {
        if (element._sum.qnt > 0 && element._sum.sum > 0) {
          registrator_id = element.registrator_id;
          break;
        }
      }
    }
    //console.log(res);
    //logger.info('server/product.service.js - getLastRegistrator end');
    return registrator_id;
  } catch (error) {
    console.log('parser/exportPage.js - getLastRegistrator ' + error.stack);
    logger.error('parser/exportPage.js - getLastRegistrator ' + error.stack);
  }
}

exportPrice();
