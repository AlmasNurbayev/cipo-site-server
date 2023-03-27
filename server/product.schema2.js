export const getProductsSchema2 = {
    schema: {
        swagger: "2.0",
        //openapi: "3.0.0",        
        info: {
            tags: ['products'],
            description: "get products",
        },
        paths: {
            "/api/product": {
                get: {
                    parameters: {
                        size: {
                            description: "array of sizes",
                            in: "query",
                            type: "array",
                            items: { type: "string" }
                        },
                        product_group: {
                            description: "array of product_group",
                            in: "query",
                            type: "array",
                            items: { type: "number" }
                        },
                        brend: {
                            description: "array of brend",
                            in: "query",
                            type: "array",
                            items: { type: "number" }
                        },    
                        price: {
                            description: "array of 2 price - min and max ",
                            in: "query",
                            type: "array",
                            items: { type: "number" }
                        },                                             

                    },

                    // required: false,
                    // schema: {

                    // //required: ["dateStart", "dateEnd"],
                    //     type: "object",
                    //     properties: {
                    //         size: { type: "array", items: { type: "string" } },
                    //         product_group: { type: "array", items: { type: "number" } },
                    //         brend: { type: "array", items: { type: "number" } },
                    //         price: { type: "array", items: { type: "number" }, description: "only 2 values - min and max" },
                    //     },
                    // },
                    //},
                    responses: {
                        200: {
                            description: "need JWT admin token",
                            schema: {
                                type: "object",
                                properties: {
                                    responce: { type: "string" },
                                }
                            }
                        }
                    },
                    400: {
                        description: "error response",
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        }
                    },
                    401: {
                        description: "Unauthorized",
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        }
                    },
                    500: {
                        description: "unknown error",
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        }
                    }
                }
            }
        }
    }
}
