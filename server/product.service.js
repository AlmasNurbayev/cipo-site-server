import { prismaI } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

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
        let res_size = undefined;
        let res_product_group= undefined;
        if (parameters.size) {
            res_size = await prismaI.size.findMany({where: {name_1c: { in: parameters.size},},})
        }
        if (parameters.product_group) {
            res_product_group = await prismaI.product_group.findMany({where: {id: { in: parameters.product_group},},})
        }        
        


        return [res_size, res_product_group];
    } catch (error) {
        logger.error('server/product.service.js' + error.stack);
        console.log(error.stack);
    }
    
    

}