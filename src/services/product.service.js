'use strict';

const { clothing, product, electronic, furniture } = require('../models/product.modle');
const { BadRequestError } = require('../core/error.response');

class ProductService {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductService.productRegistry[type] = classRef;
    }

    static createProduct = async (type, payload) => {
        const productClass = ProductService.productRegistry[type];

        if (!productClass) throw new BadRequestError(`Invalid product ${type}!`);

        return await new productClass(payload).createProduct();
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
class Furniture extends Product {
    createProduct = async () => {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw new BadRequestError('Failed to create furniture error!');
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Failed to create product error!');
        return newProduct;
    };
}

// register product types
ProductService.registerProductType('Clothing', Clothing);
ProductService.registerProductType('Electronics', Electronics);
ProductService.registerProductType('Furniture', Furniture);

module.exports = ProductService;
