'useStrict';

import { prismaI } from "../utils/prisma.js";
import { logger, writeLog } from "../utils/logger.js";
import { groupAndSum } from "./utils.js";
import { getNames } from "./utils.js";
import json2xls from 'json2xls';
import fs from 'fs'
import e from "express";

/**
 * получаем из базы последний номер регистратора, с которым в регистре есть остатки и цены
 * @function
  * @return {number} возвращаем id регистратора
 */
async function getLastRegistrator() {
    logger.info('server/product.service.js - getLastRegistrator start');
    let registrator_id = undefined;

    try {
        const res = await prismaI.qnt_price_registry.groupBy({
            by: ['registrator_id'],
            _sum: {
                qnt: true,
                sum: true
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
            };
        };
        //console.log(res);
        logger.info('server/product.service.js - getLastRegistrator end');
        return registrator_id;
    }
    catch (error) {
        console.log('server/product.service.js - getLastRegistrator ' + error.stack);
        logger.error('server/product.service.js - getLastRegistrator ' + error.stack);
    }
}


/**
 * получаем из базы выборку товаров и их цен/размеров
 * @function
 * @param {string} parameters - объект со значениями фильтра согласно схеме in query
 * @return {array} возвращаем массив объектов (товаров) с реквизитами согласно схеме
 */
export async function getProductsService(parameters) {
    logger.info('server/product.service.js - getProductsService start');
    let where = {};
    for (const key in parameters) {
        where[key] = parameters[key];
    };
    let query = {
        where: where
    };
    console.log('get query product ' + JSON.stringify(query));

    const registrator_id = await getLastRegistrator();

    try {
        let minprice = undefined;
        let maxprice = undefined;
        // let res_size = undefined;
        // let res_product_group = undefined;
        let res_qnt_price = undefined;
        // if (parameters.size) {
        //     res_size = await prismaI.size.findMany({ where: { name_1c: { in: parameters.size }, }, })
        // }
        // if (parameters.product_group) {
        //     res_product_group = await prismaI.product_group.findMany({ where: { id: { in: parameters.product_group }, }, })
        // }
        if (parameters.price) {
            if (parameters.price[0] && parameters.price[1]) {
                minprice = parameters.price[0];
                maxprice = parameters.price[1];
                if (maxprice < minprice) {
                    logger.error('server/product.service.js - getProductsService, parameter Price min > max');
                }
            } else {
                logger.error('server/product.service.js - getProductsService, parameter Price is not two numbers');
            }
        }

        /// нужно все товары сгуппировать в блоки -Товар-Цена, тогда 1 товар может выведен в несколько строк, если внутри разные цены
        let query1 = {
            select: {
                product_id: true,
            },
            by: ['product_id', 'sum', 'product_group_id'],
            orderBy: {
                product_id: 'desc',
            },
            where: {
                registrator_id: {
                    equals: registrator_id
                },
                qnt: {
                    gt: 0,
                },
                sum: {
                    gt: 0,
                }
            }
        }
        if (parameters.sort) {
            query1.orderBy = {
                [parameters.sort[0]]: parameters.sort[1]
            };
        };
        if (parameters.take) {
            query1.take = parameters.take;
        };
        if (parameters.skip) {
            query1.skip = parameters.skip;
        };
        query1.where.product_group_id = { in: parameters.product_group };
        query1.where.size_id = { in: parameters.size };
        query1.where.sum = { lte: maxprice, gte: minprice };

        let res1 = await prismaI.qnt_price_registry.groupBy(query1);
        //console.log(res1);
        let res_id = [];
        if (res1 !== null) {
            res_id = res1.map(e => {
                return e.product_id;
            });
        }

        let query2 = {
            include: {
                product_group: {
                    select: {
                        id: true,
                        name_1c: true,
                    }
                },
                product: {
                    select: {
                        artikul: true,
                        description: true,
                        material_podoshva: true,
                        material_up: true,
                        material_inside: true,
                        create_date: true,
                        sex: true,
                        image_registry: {
                            select: {
                                id: true,
                                name: true,
                                active: true,
                                main: true,
                                full_name: true,
                            },
                            where:
                            {
                                main: { equals: true },
                                active: { equals: true }
                            }
                        },

                    },
                },
            },

            where:
            {
                registrator_id: registrator_id,
                product_id: { in: res_id }
            }
        };
        if (parameters.sort) {
            query2.orderBy = {
                [parameters.sort[0]]: parameters.sort[1]
            };
        };
        res_qnt_price = await prismaI.qnt_price_registry.findMany(query2)
        //console.log(res_qnt_price);
        // приводим массив данных к формату схемы    
        let qnt_price_group = res_qnt_price;
        if (res_qnt_price.length > 0) {

            // let keys = Object.keys(res_qnt_price[0]); // удаляем повторяющиеся ключи
            // keys = keys.filter(e => {
            //     if (e != 'size_name_1c' && e != 'store_id' && e != 'size_id' && e != 'id' && e != 'store_id'
            //         && e != 'product' && e != 'product_group' && e != 'sum' && e != 'qnt'
            //         && e != 'create_date' && e != 'change_date' && e != 'operation_date') {
            //         return true;
            //     }
            // })

            //qnt_price_group = groupAndSum(res_qnt_price, keys, ['qnt']);   // создаем массив сгруппированный по продуктам 
            qnt_price_group = res1;

            for (const element_group of qnt_price_group) {
                element_group.qnt_price = [];
                for (const element of res_qnt_price) { // перебираем полный массив, чтобы заполнить сгруппированный массив
                    if (element_group.product_id != element.product_id) {
                        continue;
                    };
                    if (element_group.sum != element.sum) {
                        continue;
                    };
                    delete (element_group.qnt);
                    element_group.artikul = element.product.artikul;
                    element_group.description = element.product.description;
                    element_group.material_podoshva = element.product.material_podoshva;
                    element_group.material_up = element.product.material_up;
                    element_group.sex = element.product.sex;
                    element_group.product_group_name = element.product_group.name_1c;
                    element_group.material_inside = element.product.material_inside;
                    //element_group.image_registry = element.product.image_registry;
                    if (element.product.image_registry) {
                        element_group.image_active_path = element.product.image_registry[0].full_name;
                    }
                    element_group.date = element.product.create_date;
                    element_group.qnt_price.push({ // вложенный объект с ценами
                        size: element.size_name_1c,
                        qnt: Number(element.qnt),
                        sum: Number(element.sum),
                        store_id: element.store_id,
                        //                        store: element.store_id,
                    })
                }
            }
            for (const element_group of qnt_price_group) {
                if (element_group.qnt_price.length > 0) { // во вложенном объекте с ценами группируем повторяющиеся размеры одного продукта
                    element_group.qnt_price = groupAndSum(element_group.qnt_price, ['size', 'sum'], ['qnt'], ['store_id'])
                }
            }

        }

        writeLog('res_qnt_price.txt', JSON.stringify(qnt_price_group));

        var xls = json2xls(res_qnt_price);
        fs.writeFileSync('logs/res_qnt_price.xlsx', xls, 'binary');
        logger.info('server/product.service.js - getProductsService ended');
        return qnt_price_group;
    } catch (error) {
        logger.error('server/product.service.js - getProductsService ' + error.stack);
        console.log(error.stack);
    }

}

/**
 * получаем из базы выборку 4-х справочников, где есть остатки. Необходимо для создания фильтров на фронте
 * @function
 * @return {object} возвращаем объект с массивами size, brend, товарными группами, ценами
 */
export async function getProductsFiltersService() {
    logger.info('server/product.service.js - getProductsFilters start');
    let obj_all = {};
    const registrator_id = await getLastRegistrator();

    if (!registrator_id) {
        logger.info('server/product.service.js - getProductsFilters ended not registrator');
        return obj_all;
    }

    async function getTables(field) { // возвращает сгруппированнные записи регистра по заданному полю
        try {
            const res = await prismaI.qnt_price_registry.groupBy({
                by: [field],
                orderBy: {
                    [field]: 'asc',
                },
                where: {
                    registrator_id: {
                        equals: registrator_id
                    },
                    qnt: {
                        gt: 0,
                    },
                    sum: {
                        gt: 0,
                    }
                }
            });
            return res;
        }
        catch (error) {
            console.log('server/product.service.js - getProductsFilters ' + error.stack);
            logger.error('server/product.service.js - getProductsFilters ' + error.stack);
        }
    };

    let res_size = await getTables('size_id');
    res_size = res_size.map(e => {
        return e.size_id;
    });
    obj_all.size = await getNames('size', res_size, 'name_1c');

    let res_product_group = await getTables('product_group_id');
    res_product_group = res_product_group.map(e => {
        return e.product_group_id;
    });
    obj_all.product_group = await getNames('product_group', res_product_group, 'name_1c');

    let res_brend = await getTables('product_id');
    res_brend = res_brend.map(e => {
        return e.product_id;
    });
    obj_all.brend = await getNames('brend', res_brend, 'name_1c');

    let res_store = await getTables('store_id');
    res_store = res_store.map(e => {
        return e.store_id;
    });
    obj_all.store = await getNames('store', res_store, 'name_1c');


    logger.info('server/product.service.js - getProductsFilters end');
    return obj_all;

}

/**
 * получаем из базы товар по его id
 * @function
 * @param {string} product_id - id товара
 * @return {array} возвращаем объект товара с реквизитами согласно схеме и его размеры/цены
 */
export async function getProductService(product_id, name_1c) {

    console.log('server/product.service.js - getProductService start ' + product_id + ' / ' + name_1c);
    logger.error('server/product.service.js - getProductService start ' + product_id + ' / ' + name_1c);



    let data = {
        include: {
            product_group: {
                select: {
                    id: true,
                    name_1c: true,
                }
            },
            image_registry: {

            },
            qnt_price_registry: {
                select: {
                    size_id: true,
                    size_name_1c: true,
                    qnt: true,
                    sum: true,
                    store_id: true,
                },
                where: {
                    registrator_id: await getLastRegistrator()
                }
            },
        },
    }
    let res = {};
    try {

        if (product_id) {
            data.where = {
                id: product_id,
            };
            res = await prismaI.product.findUnique(data);
        } else {
            data.where = {
                name_1c: name_1c
            };
            res = await prismaI.product.findFirst(data);
        }
        //console.log(JSON.stringify(data));
        if (res.hasOwnProperty('qnt_price_registry')) {
            if (res.qnt_price_registry.length > 0) {
                res.qnt_price_registry_group = groupAndSum(res.qnt_price_registry, ['size_id', 'side_name_id', 'sum'], ['qnt'], ['store_id']);
            }
        }
        //console.log(res);
        writeLog('product' + product_id + '.txt', JSON.stringify(res));
        return res;
    }
    catch (error) {
        console.log('server/product.service.js - getProductService ' + error.stack);
        logger.error('server/product.service.js - getProductService ' + error.stack);
    }

    return res;
}

/**
 * получаем из базы новые товары, на базе реквизита create_data
 * @function
 * @param {number} news - кол-во последних товаров
 * @return {array} возвращаем массив объектов товаров с реквизитами согласно схеме и цены/размеры
 */
export async function getProductsNewsService(news) {
    if (!news) {
        news = 10;
    }
    let res = [];
    logger.info('server/product.service.js - getProductsNewsService start');
    console.log('get getProductsNewsService', news);
    const registrator_id = await getLastRegistrator();

    let query1 = { // выбираем последние продукты по дате создания
        orderBy: {
            create_date: 'desc',
        },
        where: {
            public_web: true
        },
        take: news
    }
    let res1 = await prismaI.product.findMany(query1);

    let res_id = []; // создам массив с id выбранных продуктов
    if (res1 !== null) {
        res_id = res1.map(e => {
            return e.id;
        });
    }

    let query2 = {  // делаем запрос по остаткам и ценам
        include: {
            product_group: {
                select: {
                    id: true,
                    name_1c: true,
                }
            },
            product: {
                select: {
                    artikul: true,
                    description: true,
                    material_podoshva: true,
                    material_up: true,
                    material_inside: true,
                    create_date: true,
                    sex: true,
                    image_registry: {
                        select: {
                            id: true,
                            name: true,
                            active: true,
                            main: true,
                            full_name: true,
                        },
                        where:
                        {
                            active: { equals: true }
                        }
                    },

                },
            },
        },

        where:
        {
            registrator_id: registrator_id,
            product_id: { in: res_id }
        }
    };
    console.log(registrator_id, res_id);
    let res2 = await prismaI.qnt_price_registry.findMany(query2)

    
    for (const element_group of res1) {
        element_group.qnt_price = [];
        for (const element of res2) { // перебираем полный массив, чтобы заполнить сгруппированный массив
            if (element_group.id != element.product_id) {
                continue;
            };
            // element_group.artikul = element.product.artikul;
            // element_group.description = element.product.description;
            // element_group.material_podoshva = element.product.material_podoshva;
            // element_group.material_up = element.product.material_up;
            // element_group.sex = element.product.sex;
            // element_group.product_group_name = element.product_group.name_1c;
            // element_group.material_inside = element.product.material_inside;
            // //element_group.image_registry = element.product.image_registry;
            // if (element.product.image_registry) {
            //     element_group.image_active_path = element.product.image_registry[0].full_name;
            // }
            // element_group.date = element.product.create_date;
            element_group.qnt_price.push({ // вложенный объект с ценами
                size: element.size_name_1c,
                qnt: Number(element.qnt),
                sum: Number(element.sum),
                store_id: element.store_id,
                //                        store: element.store_id,
            })
        }
    }
    for (const element_group of res1) {
        if (element_group.hasOwnProperty('qnt_price')) { // во вложенном объекте с ценами группируем повторяющиеся размеры одного продукта
            element_group.qnt_price = groupAndSum(element_group.qnt_price, ['size', 'sum'], ['qnt'], ['store_id'])
        }
    }


    return res1;

}