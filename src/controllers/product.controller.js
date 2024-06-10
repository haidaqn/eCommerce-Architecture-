'use strict';

const ProductService = require('../services/product.service');
const { CreateSuccessResponse, OK, SuccessResponse } = require('../core/success.response');

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product created successfully!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userID
            })
        }).send(res);
    };
}

module.exports = new ProductController();
