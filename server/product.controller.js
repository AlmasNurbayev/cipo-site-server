'useStrict';

import { logger } from "../utils/logger.js";
import { getProductsService, getProductsFiltersService, getProductService, getProductsNewsService } from "./product.service.js";

export async function getProduct(request, responce) {
    logger.info('server / product_service.js - getProduct receive query: ' + JSON.stringify(request.query));
    let { id } = request.query;    
    const product_id = parseInt(id);

    const res = await getProductService(product_id);
    if (res === null) {
        responce.status(400).send();    
    } else {

        responce.status(200).json(res);
    }

    

    logger.info('server / product_service.js - getProducts ended');
}   

export async function getProducts(request, responce) {
    logger.info('server / product_service.js - getProducts receive query: ' + JSON.stringify(request.query));

    let { size, product_group, brend, price, take, skip, sort  } = request.query;
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

    if (product_group) {
        product_group = product_group.split(',');
        product_group = product_group.map((x) => { return parseInt(x) });
    }

    if (brend) {
        brend = brend.split(',');
        brend = brend.map((x) => { return parseInt(x) });
    }

    if (price) {
        price = price.split(',');
        price = price.map((x) => { return parseInt(x) });
    }

    if (sort) {
        sort = sort.split('-');
    }

    const res = await getProductsService({size: size, product_group: product_group, brend: brend, price: price, take: take, skip: skip, sort: sort});
    
    if (res === null) {
        responce.status(400).send();    
    } else {
        responce.status(200).json(res);
    }

    
    logger.info('server / product_service.js - getProducts ended');
}

export async function getProductsNews(request, responce) {
    logger.info('server / product_service.js - getProductsNews receive query: ' + JSON.stringify(request.query));

    let { news } = request.query;
    // [ '31', ' 32' ] [ 1, 3 ] [ 4, 5 ] [ 10000, 50000 ]

    if (news) {
        news = parseInt(news);
    }

    const res = await getProductsNewsService(news);
    
    if (res === null) {
        responce.status(400).send();    
    } else {
        responce.status(200).json(res);
    }

    
    logger.info('server / product_service.js - getProductsNews ended');
}

export async function getProductsFilter(request, responce) {
    logger.info('server / product_service.js - getProductsFilter receive query: ' + JSON.stringify(request.query));
    const res = await getProductsFiltersService();
    responce.status(200).json(res);
    logger.info('server / product_service.js - getProductsFilter ended');
}
