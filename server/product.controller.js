'useStrict';

import { logger } from "../utils/logger.js";
import checkAJV from "./checkAJV.js";
import { getProductsSchema } from "./product.schema.js";
import { getProductsSchema2 } from "./product.schema2.js";
import { getProductsService } from "./product.service.js";

export async function getProduct(req, res) {

}

export async function getProducts(request, responce) {
    logger.info('server / product_service.js - getProducts receive query: ' + request.query);

    let { size, product_group, brend, price } = request.query;
    // [ '31', ' 32' ] [ 1, 3 ] [ 4, 5 ] [ 10000, 50000 ]

    if (size) {
        size = size.split(',');
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

    const res = await getProductsService({size: size, product_group: product_group, brend: brend, price: price});

    // const input_schema = getProductsSchema.schema.paths["/api/product"].get.parameters;
    // const res = checkAJV(input_schema, [size, product_group, brend, price]);
    // console.log(res);


    responce.status(200).json(res);
}

export async function getProductsFilters() {

}

