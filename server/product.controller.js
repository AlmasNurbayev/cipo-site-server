'useStrict';

import { logger } from "../utils/logger.js";
import { getProductsService, getProductsFiltersService, getProductService, getProductsNewsService } from "./product.service.js";

export async function getProduct(request, responce) {
    logger.info('server / product.controller.js - getProduct receive query: ' + JSON.stringify(request.query));
    console.log('server / product.controller.js - getProduct receive query: ' + JSON.stringify(request.query));
    let { id, name_1c } = request.query;    
    
    const product_id = parseInt(id);

    const res = await getProductService(product_id, name_1c);
    if (res === null || Object.keys(res).length === 0) { // проверяем на пустой объект
        responce.status(400).send();    
        logger.info('server / product.controller.js - 400 getProduct ended');
    } else {
        responce.status(200).json(res);
        logger.info('server / product.controller.js - 200 getProduct ended');
    }
    
}   

export async function getProducts(request, responce) {
    logger.info('server / product.controller.js - getProducts receive query: ' + JSON.stringify(request.query));

    let { size, product_group, brend, take, skip, sort, maxPrice, minPrice, vid_modeli, search_name  } = request.query;
    // [ '31', ' 32' ] [ 1, 3 ] [ 4, 5 ] [ 10000, 50000 ]

    if (take) {
        take = parseInt(take);
    }

    if (skip) {
        skip = parseInt(skip);
    }

    if (size) {
        size = size.split(',');
        size = size.map((x) => { return parseInt(x) });
    }

    if (vid_modeli) {
        vid_modeli = vid_modeli.split(',');
        vid_modeli = vid_modeli.map((x) => { return parseInt(x) });
    }    

    if (product_group) {
        product_group = product_group.split(',');
        product_group = product_group.map((x) => { return parseInt(x) });
    }

    if (brend) {
        brend = brend.split(',');
        brend = brend.map((x) => { return parseInt(x) });
    }

    if (minPrice) {minPrice = parseInt(minPrice)}
    if (maxPrice) {maxPrice = parseInt(maxPrice)}

    if (sort) {
        sort = sort.split('-');
    }

    const res = await getProductsService({vid_modeli: vid_modeli, size: size, product_group: product_group, brend: brend, minPrice: minPrice, maxPrice: maxPrice , take: take, skip: skip, sort: sort, search_name: search_name});
    
    if (res === null) {
        responce.status(400).send();    
        logger.info('server / product.controller.js - 400 getProducts ended');
    } else {
        responce.status(200).json(res);
        logger.info('server / product.controller.js - 200 getProducts ended');
    }

}

export async function getProductsNews(request, responce) {
    logger.info('server / product.controller.js - getProductsNews receive query: ' + JSON.stringify(request.query));

    let { news } = request.query;
    // [ '31', ' 32' ] [ 1, 3 ] [ 4, 5 ] [ 10000, 50000 ]

    if (news) {
        news = parseInt(news);
    }

    const res = await getProductsNewsService(news);
    
    if (res === null) {
        responce.status(400).send();    
        logger.info('server / product.controller.js - getProductsNews 400 ended');
    } else {
        responce.status(200).json(res);
        logger.info('server / product.controller.js - getProductsNews 200 ended');
    }

}

export async function getProductsFilter(request, responce) {
    logger.info('server / product.controller.js - getProductsFilter receive query: ' + JSON.stringify(request.query));
    const res = await getProductsFiltersService();
    responce.status(200).json(res);
    logger.info('server / product.controller.js - getProductsFilter ended');
}
