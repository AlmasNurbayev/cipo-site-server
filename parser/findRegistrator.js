import { formatISO } from 'date-fns';

export function findRegistrator(obj, user_id, path, file) {
    const obj_registrator = {};
    obj_registrator.operation_date = formatISO(Date.now(), { representation: 'complete' });
    obj_registrator.date_schema = obj.elements[0].attributes.ДатаФормирования;
    obj_registrator.ver_schema = obj.elements[0].attributes.ВерсияСхемы;
    obj_registrator.name_folder = path;
    obj_registrator.name_file = file;
    obj_registrator.id_class = obj.elements[0].elements[0].elements[0].elements[0].text;
    obj_registrator.name_class = obj.elements[0].elements[0].elements[1].elements[0].text;
        const string_only_change = obj.elements[0].elements[1].attributes.СодержитТолькоИзменения;
        if (string_only_change === 'false') {
            obj_registrator.only_change = false;
        } else {obj_registrator.only_change = true} 
    obj_registrator.name_catalog = obj.elements[0].elements[1].elements[2].elements[0].text;
    obj_registrator.id_catalog = obj.elements[0].elements[1].elements[1].elements[0].text;    
    obj_registrator.user_id = user_id;
    return obj_registrator;
}