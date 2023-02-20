import { findNestedObj } from "./findProperties.js";


/**
 * парсим дерево import0_1.xml в поисках корневого элемента prop_root, разворачиваем в массив группу name
 * @function
 * @param {string} obj - полный объект
 * @param {string} prop_root - название корневого узла от которого ищем дальше
 * @param {string} prop_name - название узла конкретная Группа, который надо развернуть в массив
 * @return {Array} возвращаем элементы справочника Свойства как  массив с объектами, поля id_1c, name_1c 
 */
export function findVid(obj, prop_root, name) {
    const arr = [];
    const tree0 = findNestedObj(obj, 'name', prop_root);

    if (tree0) {
        const tree = findNestedObj(tree0, 'name', name);
        if (tree) {
            tree.elements.forEach(element => {
                arr.push({
                    id_1c:  element.elements[0].elements[0].text,
                    name_1c: element.elements[1].elements[0].text    
                });                 
            });
        }
    }
    return arr;
}