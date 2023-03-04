import { prismaI } from "../utils/prisma.js";
import { logger, writeLog } from "../utils/logger.js";
import { groupAndSum } from "./utils.js";
import json2xls from 'json2xls';
import fs from 'fs'
import e from "express";

async function getLastRegistrator() {


}


// import * as XLSX from "xlsx"; // устанавливать через CDN https://docs.sheetjs.com/docs/getting-started/installation/nodejs
// import * as cptable from "xlsx/dist/cpexcel.full.mjs";
// import * as fs from 'fs';

export async function getProductsService(parameters) {

    let where = {};
    for (const key in parameters) {
        //        if key === 'produ'
        where[key] = parameters[key];
    };
    let query = {
        where: where
    };
    console.log(JSON.stringify(query));

    try {
        let minprice = undefined;
        let maxprice = undefined;
        let res_size = undefined;
        let res_product_group = undefined;
        let res_qnt_price = undefined;
        if (parameters.size) {
            res_size = await prismaI.size.findMany({ where: { name_1c: { in: parameters.size }, }, })
        }
        if (parameters.product_group) {
            res_product_group = await prismaI.product_group.findMany({ where: { id: { in: parameters.product_group }, }, })
        }
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

        res_qnt_price = await prismaI.qnt_price_registry.findMany(
            {
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
                    product_group_id: { in: parameters.product_group },
                    size_name_1c: { in: parameters.size },
                    sum: { lte: maxprice, gte: minprice }
                }
            })

        // приводим массив данных к формату схемы    
        let qnt_price_group = []; 
        if (res_qnt_price.length > 0) { 

            let keys = Object.keys(res_qnt_price[0]); // удаляем повторяющиеся ключи
            keys = keys.filter(e => {
                if (e != 'size_name_1c' && e != 'store_id' && e != 'size_id' && e != 'id' && e != 'store_id'
                    && e != 'product' && e != 'product_group' && e != 'sum' && e != 'qnt'
                    && e != 'create_date' && e != 'change_date' && e != 'operation_date') {
                    return true;
                }
            })

            qnt_price_group = groupAndSum(res_qnt_price, keys, ['qnt']);   // создаем массив сгруппированный по продуктам 

            for (const element_group of qnt_price_group) {
                element_group.qnt_price = [];
                for (const element of res_qnt_price) { // перебираем полный массив, чтобы заполнить сгруппированный массив
                    if (element_group.product_id != element.product_id) {
                        continue;
                    }
                    delete (element_group.qnt);
                    element_group.artikul = element.product.artikul;
                    element_group.description = element.product.description;
                    element_group.material_podoshva = element.product.material_podoshva;
                    element_group.material_up = element.product.material_up;
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
                        discount_percent: element.discount_percent,
                        discount_begin: element.discount_begin,
                        discount_end: element.discount_end,
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



        writeLog('res_qnt_price.txt', JSON.stringify(res_qnt_price));

        var xls = json2xls(res_qnt_price);
        fs.writeFileSync('logs/res_qnt_price.xlsx', xls, 'binary');

        return qnt_price_group;
    } catch (error) {
        logger.error('server/product.service.js' + error.stack);
        console.log(error.stack);
    }

}

