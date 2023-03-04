'useStrict';

import { findDB } from "./findDB.js";

/**
 * глубокий поиск внутри дерева объектов пары ключ-значение
 * @function
 * @param {string} entireObj - объект, где ищем
 * @param {string} keyToFind - ключ, которыq ищем
 * @param {string} valToFind - значение, которое ищем 
 * @return {Object} найденный объект и вложенные объекты 
 */
export function findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj = undefined;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

/**
 * парсим дерево import0_1.xml в поисках корневого элемента Свойства, разворачиваем в массив группу Свойство 
 * @function
 * @param {function} tx - экземпляр Призма для записи транзакций
 * @param {string} obj - полный объект
 * @param {string} prop_root - название узла Свойства от которого ищем дальше
 * @param {string} prop_name - название узла конкретное Свойство, который надо развернуть в массив
 * @return {object} возвращаем в объекте 2 массива Товарных групп, record - для записи новых, update - для обновления
 */
export async function findProperties(tx, obj, prop_root, prop_name) {
    const arr_record = [];
    const arr_update = [];
    const product_group_all = await findDB(tx, 'product_group', '', '', ''); // для проверки дублей
    const tree_properties = (findNestedObj(obj, 'name', prop_root));
    if (tree_properties.elements) {
        tree_properties.elements.forEach(element => {
            //console.log(element.elements[1].elements[0].text);
            if (element.elements[1].elements[0].text == prop_name) {
                //const tree_properties_product_group = element;
                const tree_properties_product_group_tree = (findNestedObj(element, 'name', 'ВариантыЗначений'));
                if (tree_properties_product_group_tree) {
                    //console.log(tree_properties_product_group_tree);
                    tree_properties_product_group_tree.elements.forEach(element2 => {
                        let data = {
                            id_1c:  element2.elements[0].elements[0].text,
                            name_1c: element2.elements[1].elements[0].text    
                        };
                        let duplicate = product_group_all.find(e => e.id_1c === data.id_1c)
                        if (duplicate) {
                            arr_update.push(data); 
                        } else {
                            arr_record.push(data); 
                        }
                    })
                }
            }
        });
        return {
            record: arr_record,
            update: arr_update
        };
        
    }
}