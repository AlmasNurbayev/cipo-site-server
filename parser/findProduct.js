import { findNestedObj } from "./findProperties.js";
import { findDB } from "./findDB.js";
import { formatISO } from 'date-fns';
import fs from 'fs';
import { logger } from "../utils/logger.js";
import { log } from "console";


/**
 * парсим объект с товарами и возвращаем массив объектов (товаров) с реквизитами
 * @function
 * @param {string} obj - объект с товарами
 * @param {string} currentPath - путь до папки с загрузкой, нужен для добавления к пути картинок
 * @return {array} возвращаем массив объектов (товаров) с реквизитами. Внутри по 1 объекту на каждый товар
 */
export async function findProduct(obj, currentPath) {
    const arr = [];
    const currentDate = formatISO(Date.now(), { representation: 'complete' });
    const product_vid_all = await findDB('product_vid', '', '', '');
    const product_folder_all = await findDB('product_folder', '', '', '');
    const product_group_all = await findDB('product_group', '', '', '');
    const product_desc_mapping_all = await findDB('product_desc_mapping', '', '', '');

    console.table(product_group_all);
    console.table(product_desc_mapping_all);


    const tree_properties = (findNestedObj(obj, 'name', 'Товары'));
    if (tree_properties.elements) {
        tree_properties.elements.forEach(element => { // цикл по товарам

            // ищем реквизиты продукта
            let name_1c = undefined;
            let artikul = undefined;
            let product_folder_id = undefined;
            let product_group_id = undefined;
            let description = undefined;
            let id_1c = undefined;
            let base_ed = undefined;
            let material_up = undefined;
            let material_inside = undefined;
            let material_podoshva = undefined;
            const images = [];

            element.elements.forEach((element_2) => { // цикл по ключам
                if (element_2.name === 'Наименование') {
                    //console.log(element_des);
                    if (element_2.elements) {
                        name_1c = element_2.elements[0].text;
                    }
                }
                if (element_2.name === 'Артикул') {
                    //console.log(element_des);
                    if (element_2.elements) {
                        artikul = element_2.elements[0].text;
                    }
                }     
                if (element_2.name === 'Ид') {
                    //console.log(element_des);
                    if (element_2.elements) {
                        id_1c = element_2.elements[0].text;
                    }
                }              
                if (element_2.name === 'БазоваяЕдиница') {
                    //console.log(element_des);
                    if (element_2.elements) {
                        base_ed = element_2.attributes.НаименованиеПолное;
                    }
                }                         
                
                    
                if (element_2.name === 'Группы') {
                    //console.log(element_des);
                    if (element_2.elements) {
                        const fold_id = element_2.elements[0].elements[0].text;
                        const product_folder_find = product_folder_all.find(e => e.id_1c === fold_id);
                        //const product_folder_find = product_folder_all.find(e => e.id_1c === '123');
                        if (product_folder_find) {
                            product_folder_id = product_folder_find.id;
                        }
                    }
                }        
                if (element_2.name === 'Описание') {
                    //console.log(element_des);
                    if (element_2.elements) {
                        description = element_2.elements[0].text;
                    }
                }    
                if (element_2.name === 'Картинка') {
                    const obJ_image = { file: currentPath + '/' + element_2.elements[0].text };
                    obJ_image.size = 0;
                    if (images.length === 0) {
                        obJ_image.main = true; // первая картинка становится главной
                    } else { obJ_image.main = false }

                    try { // пытаемся получить размер в синхронном режиме
                        let stat = fs.statSync(obJ_image.file);
                        obJ_image.size = stat.size;
                        //console.log(stat);
                    } catch (error) {
                        logger.error('parser/findProduct.js - file size measure ' + obJ_image.file + ' - ' + error.stack)
                    }

                    obJ_image.main_change_date = currentDate;
                    obJ_image.active = true; // Boolean // использовать ли этот пункт для отображения или отключить
                    obJ_image.active_change_date = currentDate; // DateTime @db.Timestamptz                            
                    images.push(obJ_image);
                    //console.log(obJ_image);
                }   
                if (element_2.name === 'ЗначенияСвойств') {
                    if (element_2.elements) {
                        const res_sv = findProductSv(element_2.elements, product_group_all, product_desc_mapping_all); // декомпозируем поиск Свойств товара в отдельную функцию
                        console.log(JSON.stringify(res_sv));
                        product_group_id = res_sv.group;
                        // if (Array.isArray(res_sv.desc)) {
                                ({material_up, material_inside, material_podoshva} = res_sv.desc); // т.к. эти переменные уже объявлены, то всю деструктуризацию нужно обернуть в скобки
                                // console.log(material_up, material_inside, material_podoshva);
                        // }
                    }
                }                                                           
                if (element_2.name === 'ЗначенияРеквизитов') {
                    if (element_2.elements) {
                        const res_rc = findProductRc(element_2.elements, product_vid_all); // декомпозируем поиск Свойств товара в отдельную функцию
                    }
                }                                                           

            })

            arr.push({
                artikul: artikul,
                name_1c: name_1c,
                id_1c: id_1c,
                base_ed: base_ed,
                product_folder_id: product_folder_id,
                description: description,
                images: images,
                product_group_id: product_group_id, 
                material_up: material_up,
                material_inside: material_inside,
                material_podoshva: material_podoshva,

                //const product_group_finded = await findDB('product_group', 'id_1c', element.elements[4].elements[0].elements[0].text);
                //product_group_finded: product_group_finded, 
            })

        })
    }
    //console.log(arr);
    //    console.log(product_folder_all);
    return arr;

}

/**
 * парсим объект со свойствами товара и возвращаем объект свойств
 * @function
 * @param {object} root - объект со свойствами товара
 * @param {array} product_group_all - массив строк таблицы product_group
 * @param {array} product_desc_mapping_all - массив строк таблицы product_desc_mapping
 * @return {object} возвращаем объект со свойствами
 */
function findProductSv(root, product_group_all, product_desc_mapping_all) {
    
    const res = {};
    res.desc = {};

    root.forEach(element => {
         //console.log('===================');
        //  console.log(element);
        //  console.log('------------');
         //console.log(element.elements[0].elements[0].text);
         //console.log(element.elements[1].elements[0].text);
        let product_group_id = 0;
        const group_id = element.elements[1].elements[0].text;
        const product_group_find = product_group_all.find(e => e.id_1c === group_id);
        if (product_group_find) {
            product_group_id = product_group_find.id;
            //console.log(product_group_id, product_group_find.name_1c);
            res.group = product_group_id;        
        }

        const desc_id = element.elements[0].elements[0].text;
        const product_desc_mapping_find = product_desc_mapping_all.find(e => e.id_1c === desc_id);
        if (product_desc_mapping_find) {
                res.desc[product_desc_mapping_find.field] = element.elements[1].elements[0].text;
            }
            //console.log(product_desc_mapping_id, product_desc_mapping_find.field , product_desc_mapping_find.name_1c);

    })
    //console.log(JSON.stringify(res));
    return res;
}

export function findProductRc(root, product_vid_all) {
    const res = {};
    res.desc = {};

    root.forEach(element => {
       console.log('===================');
         console.log(element);
        //  console.log('------------');
       console.log(element.elements[0].elements[0].text);
       console.log(element.elements[1].elements[0].text);
    });
}