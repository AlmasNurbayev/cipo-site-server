'useStrict';

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
                        {
                            name: "take",
                            description: "count of records ",
                            in: "query",
                            type: "number",
                            required: false,
                            example: "20"
                        },
                        {
                            name: "skip",
                            description: "skip of records ",
                            in: "query",
                            type: "number",
                            required: false,
                            example: "1"
                        },
                        {
                            name: "sort",
                            description: "sort and order, possible: id, price",
                            in: "query",
                            type: "string",
                            required: false,
                            example: "price-desc"
                        },
                    ],
                    responses: {
                        200: {
                            description: "array of products",
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

                                        discount_percent: { type: "number" },
                                        discount_begin: { type: "string", format: "date-time" },
                                        discount_end: { type: "string", format: "date-time" },

                                        qnt_price: {
                                            type: "array", items:
                                            {
                                                type: "object", properties: {
                                                    size: { type: "string" },
                                                    price: { type: "number" },
                                                    qnt: { type: "number" },
                                                    store_id: {
                                                        type: "array", items: {
                                                            type: 'number'
                                                        }
                                                    }
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
            },
            "/api/product:id": {
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
                            name: "id",
                            description: "id of product",
                            in: "query",
                            type: "number",
                            required: false,
                            example: "5412"
                        },
                        {
                            name: "name_1c",
                            description: "name of product",
                            in: "query",
                            type: "string",
                            required: false,
                            example: "Cipo Ботинки белый 9920-814"
                        },                        
                    ],
                    responses: {
                        200: {
                            description: "object about product",
                            schema: {
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

                                    discount_percent: { type: "number" },
                                    discount_begin: { type: "string", format: "date-time" },
                                    discount_end: { type: "string", format: "date-time" },

                                    image_registry: {
                                        type: "array", items:
                                        {
                                            type: "object", properties: {
                                                id: { type: "number" },
                                                full_name: { type: "string" },
                                                name: { type: "string" },
                                                path: { type: "string" },
                                                size: { type: "number" },
                                                operation_date: { type: "string", format: "date-time" },
                                                main: { type: "boolean" },
                                                main_change_date: { type: "string", format: "date-time" },
                                                active: { type: "boolean" },
                                                active_change_date: { type: "string", format: "date-time" },
                                                product_id: { type: "number" },
                                                registrator_id: { type: "number" },
                                                create_date: { type: "string", format: "date-time" },
                                                changed_date: { type: "string", format: "date-time" },
                                            },
                                        },
                                    },
                                    qnt_price_registry: {
                                        type: "array", items:
                                        {
                                            type: "object", properties: {
                                                size_id: { type: "number" },
                                                size_name_1c: { type: "string" },
                                                sum: { type: "number" },
                                                qnt: { type: "number" },
                                                store_id: { type: 'number' }
                                            }
                                        },
                                    },
                                    qnt_price_registry_group: {
                                        type: "array", items:
                                        {
                                            type: "object", properties: {
                                                size_id: { type: "number" },
                                                sum: { type: "number" },
                                                qnt: { type: "number" },
                                                store_id: {
                                                    type: 'array', items: {
                                                        type: "number"
                                                    },
                                                }
                                            },
                                        },
                                    },
                                },
                            },
                        },
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
                },
            },
            "/api/productsFilter": {
                get: {
                    parameters: [
                        {
                            name: "token",
                            in: "header",
                            description: "token to be passed as a header",
                            "required": true,
                            example: "Bearer eyJhbGciOiJIUzI1NiIsInR5c..."
                        },
                    ],
                    responses: {
                        200: {
                            description: "object - all lists for filters",
                            schema: {
                                type: "object",
                                properties: {
                                    size: {
                                        type: "array", items: {
                                            type: "object", properties: {
                                                id: { type: "number" },
                                                name_1c: { type: "string" },
                                            }
                                        }
                                    },
                                    product_group: {
                                        type: "array", items: {
                                            type: "object", properties: {
                                                id: { type: "number" },
                                                name_1c: { type: "string" },
                                            }
                                        }
                                    },
                                    brend: {
                                        type: "array", items: {
                                            type: "object", properties: {
                                                id: { type: "number" },
                                                name_1c: { type: "string" },
                                            }
                                        }
                                    },
                                    store: {
                                        type: "array", items: {
                                            type: "object", properties: {
                                                id: { type: "number" },
                                                name_1c: { type: "string" },
                                            }
                                        }
                                    },
                                },
                            },
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
}

