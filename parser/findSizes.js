'useStrict';

import { findNestedObj } from "./findProperties.js";

/**
 * парсим дерево import0_1.xml в поисках корневого элемента Свойства, разворачиваем в массив группу Свойство 
 * @function
 * @param {string} obj - полный объект
 * @param {string} prop_root - название узла Свойства от которого ищем дальше
 * @param {string} prop_name - название узла конкретное Свойство, который надо развернуть в массив
 * @return {Array} возвращаем элементы справочника Свойства как  массив с объектами, поля id_1c, name_1c 
 */
export function findSizes(obj, prop_root, prop_name) {
    const arr = [];
    const tree_properties = (findNestedObj(obj, 'name', prop_root));
    //console.log(tree_properties);
    //const tree_properties = (findNestedObj(tree_properties0, 'name', prop_root));

    if (tree_properties.elements) {
        tree_properties.elements.forEach(element => {
            const rc_name = element.elements[2].elements[0].text; // читаем название реквизита   
            if (rc_name == prop_name) {
                    //const tree_properties_product_group = element;
                    const tree_properties_product_group_tree = (findNestedObj(element, 'name', 'ВариантыЗначений'));
                    //console.log(tree_properties_product_group_tree);
                    if (tree_properties_product_group_tree) {
                        //console.log(tree_properties_product_group_tree);
                        tree_properties_product_group_tree.elements.forEach(element2 => {
                            arr.push({
                                id_1c: element2.elements[0].elements[0].text,
                                name_1c: element2.elements[1].elements[0].text,
                            });
                        })
                    }
                }
            
        });
        return arr;

    }
}