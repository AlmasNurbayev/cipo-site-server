import { prismaI } from '../utils/prisma.js'
import { logger } from '../utils/logger.js'
import { formatISO } from 'date-fns';

export async function recordDB(type, table, obj) {

    const currentDate = formatISO(Date.now(), { representation: 'complete' });

    if (type === 'object') {
        console.log(obj);
        obj.create_date = currentDate;
        try {
            const res = await prismaI[table].create({
                data: obj
            }
            )
        } catch (error) {
            logger.error(error.stack);
            console.log(error.stack);
        }
    }
}