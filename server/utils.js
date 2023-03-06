import { logger } from "../utils/logger.js";
import { prismaI } from "../utils/prisma.js";

/**
 * получаем из массива объектов сгруппированный массив с агрегатными суммами
 * @function
 * @param {array} arr - исходный массив
 * @param {array} groupKeys - массив с именами полей для группировки
 * @param {array} sumKeys - массив с именами полей для суммирования
 * @param {array} addKeys - массив с именами полей для сбора всех свернутых значений в массив
 * @return {array} возвращаем сгуппированный массив
 */
export function groupAndSum(arr, groupKeys, sumKeys, addKeys = []) {
  return Object.values(
    arr.reduce((acc, curr) => {

      const group = groupKeys.map(k => curr[k]).join('-');
      acc[group] = acc[group] || Object.fromEntries(
        groupKeys.map(k => [k, curr[k]]).concat(sumKeys.map(k => [k, 0])));
      sumKeys.forEach(k => acc[group][k] += curr[k]);

      //console.log(acc[group]);
      //console.log(curr);
      addKeys.forEach(a => {
        if (!Array.isArray(curr[a])) {
          //console.log(acc[group][a]);

          if (!acc[group][a]) { acc[group][a] = [] }
          acc[group][a].push(curr[a]);
        };

      });


      return acc;
    }, {})
  );
}

/**
 * получаем из таблицы БД поля field и id по заданным id
 * @function
 * @param {string} table - имя таблицы
 * @param {array} id_array - массив со значениями id
 * @param {string} field - имя поля что нужно вернуть
 * @return {array} возвращаем массив с объектами в которых 2 поля - id и то что задано в field
 */
export async function getNames(table, id_array, field) {
  try {
    const res = await prismaI[table].findMany({
      select: {
        id: true,
        [field]: true
      },
      where: {
        id: {
          in: id_array
        }
      }
    });
    return res;
  }
  catch (error) {
    console.log('server/utils.js - getNames ' + error.stack);
    logger.error('server/utils.js - getNames ' + error.stack);
  }
}


