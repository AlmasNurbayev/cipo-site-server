export const getProductsSchema = {
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
                    parameters: [
                        {
                            name: "token",
                            in: "header",
                            description: "token to be passed as a header",
                            "required": true,
                            example: "Bearer eyJhbGciOiJIUzI1NiIsInR5c..."
                        },
                        {
                            name: "size",
                            description: "array of sizes",
                            in: "query",
                            type: "array",
                            items: { type: "string" },
                            required: false,
                            example: "31,32"
                        },
                        {
                            name: "product_group",
                            description: "array of product_group",
                            in: "query",
                            type: "array",
                            items: { type: "number" },
                            required: false,
                            example: "1,3"
                        },
                        {
                            name: "brend",
                            description: "array of brend",
                            in: "query",
                            type: "array",
                            items: { type: "number" },
                            required: false,
                            example: "1,3"
                        },
                        {
                            name: "price",
                            description: "array of 2 price - min and max ",
                            in: "query",
                            type: "array",
                            items: { type: "number" },
                            required: false,
                            example: "10000, 20000"
                        },


                    ],
                    responses: {
                        200: {
                            description: "need JWT admin token",
                            schema: {
                                type: "array",
                                items: {
                                    type: "object", properties: {
                                        date: { type: "string", format: "date-time" },
                                        product_id: { type: "number" },
                                        product_name: { type: "string" },
                                        product_description: { type: "string" },

                                        product_material_podoshva: { type: "string" },
                                        product_material_up: { type: "string" },
                                        product_material_inside: { type: "string" },

                                        product_brend_id: { type: "number" },
                                        product_brend_name: { type: "string" },

                                        artikul: { type: "string" },
                                        brend: { type: "string" },
                                        product_group_id: { type: "number" },
                                        product_group_name: { type: "string" },

                                        image_active_path: { type: "string" },

                                        qnt_price: {
                                            type: "array", items:
                                            {
                                                type: "object", properties: {
                                                    size: { type: "string" },
                                                    price: { type: "number" },
                                                    qnt: { type: "number" }
                                                },

                                            },
                                        },
                                    },
                                },


                            },



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
 