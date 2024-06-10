'use strict';

const { clothing, product, electronic } = require('../models/product.modle');
const { BadRequestError } = require('../core/error.response');

class ProductService {
    static createProduct = async (type, payload) => {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createProduct();
            case 'Electronics':
                return new Electronics(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid product ${type}!`);
        }
    };
}

// define base product class

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id
        });
    }
}

// define clothing product class

class Clothing extends Product {
    createProduct = async () => {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError('Failed to create clothing error!');

        const newProduct = await super.createProduct(newClothing._id);

        if (!newProduct) throw new BadRequestError('Failed to create product error!');

        return newProduct;
    };
}

// define electronic product class

class Electronics extends Product {
    createProduct = async () => {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('Failed to create electronic error!');

        const newProduct = await super.createProduct(newElectronic._id);

        if (!newProduct) throw new BadRequestError('Failed to create product error!');

        return newProduct;
    };
}

module.exports = ProductService;
