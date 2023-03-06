'useStrict';

import Router from 'express';
import { getProduct, getProducts, getProductsFilter } from './product.controller.js';
import { postOrder } from './order.controller.js';
import {getProductsSchema} from './product.schema.js';
import swaggerUi from 'swagger-ui-express'
import { getProductsSchema2 } from './product.schema2.js';


export function initRouterApi() {
    const router = new Router();
    router.get('/product', getProduct); 
    router.get('/products', getProducts);
    router.get('/productsFilter', getProductsFilter);
    router.post('/order', postOrder); 

    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(getProductsSchema.schema));


    return router; 
}

export function initRouterStatic() {
  



}
 


