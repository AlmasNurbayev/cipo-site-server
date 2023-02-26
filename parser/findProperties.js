'useStrict';

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
 * @param {string} obj - полный объект
 * @param {string} prop_root - название узла Свойства от которого ищем дальше
 * @param {string} prop_name - название узла конкретное Свойство, который надо развернуть в массив
 * @return {Array} возвращаем элементы справочника Свойства как  массив с объектами, поля id_1c, name_1c 
 */
export function findProperties(obj, prop_root, prop_name) {
    const arr = [];
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
                        arr.push({
                            id_1c:  element2.elements[0].elements[0].text,
                            name_1c: element2.elements[1].elements[0].text    
                        }); 
                    })
                }
            }
        });
        return arr;
        
    }
}