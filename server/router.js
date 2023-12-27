'useStrict';

import Router from 'express';
import { getProduct, getProducts, getProductsFilter, getProductsNews } from './product.controller.js';
import { getNews, getNewsID } from './news.controller.js';
import { postOrder } from './order.controller.js';
import { getStore } from './store.controller.js';
import { getSubscribes, postSubscribe } from './subscribe.controller.js';

import swaggerUi from 'swagger-ui-express'
import { swaggerSchema } from './swagger.schema.js';

export function initRouterApi() {
    const router = new Router();
    //router.use(startTiming); 
    router.get('/product', getProduct); 
    router.get('/news', getNews); 
    router.get('/newsID', getNewsID); 
    router.get('/stores', getStore);
    router.get('/products', getProducts);
    router.get('/productsNews', getProductsNews);
    router.get('/productsFilter', getProductsFilter);
    router.get('/Subscribes', getSubscribes);
    router.post('/postSubscribe', postSubscribe);
    
    router.post('/order', postOrder); 

    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(swaggerSchema.schema));
    
    return router; 
}

export function initRouterStatic() {
  



}
 


