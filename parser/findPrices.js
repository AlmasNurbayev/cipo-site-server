'useStrict';

import { findNestedObj } from "./findProperties.js";
import { formatISO } from 'date-fns';


/**
 * парсим дерево import0_1.xml в поисках корневого элемента prop_root, разворачиваем в массив группу name
 * @function
 * @param {string} obj - полный объект
 * @param {string} prop_root - название корневого узла от которого ищем дальше
 * @param {string} prop_name - название узла конкретная Группа, который надо развернуть в массив
 * @param {number} registrator_id - номер регистратора, нужен для включения в объект для записи в таблицу
 * @return {Array} возвращаем элементы справочника Свойства как  массив с объектами, поля id_1c, name_1c 
 */
export function findPrices(obj, prop_root, name, registrator_id) {
    const arr = [];
    const tree0 = findNestedObj(obj, 'name', prop_root);
    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    if (tree0) {
        const tree = findNestedObj(tree0, 'name', name);
        if (tree) {
            tree.elements.forEach(element => {
                const name_1c = element.elements[1].elements[0].text;
                let active = false;
                if (name_1c.includes('Розничная')) {
                    active = true;
                }
                arr.push({
                    id_1c:  element.elements[0].elements[0].text,
                    name_1c: element.elements[1].elements[0].text,    
                    active_change_date: currentDate,
                    active: active,
                    registrator_id: registrator_id
                });                 
            });
        }
    }
    return arr;
}