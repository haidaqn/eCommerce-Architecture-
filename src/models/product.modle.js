'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
    {
        product_name: { type: String, require: true },
        product_thumb: { type: String, require: true },
        product_description: { type: String, require: true },
        product_price: { type: Number, require: true },
        product_quantity: { type: Number, require: true },
        product_type: {
            type: String,
            require: true,
            enum: ['Electronics', 'Clothing', 'Furniture', 'Other']
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: {
            type: Schema.Types.Mixed,
            require: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

// difine the product type = clothing

const clothingSchema = new Schema(
    {
        brand: { type: String, require: true },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        }
    },
    {
        collation: 'clothes',
        timestamps: true
    }
);

const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            require: true
        },
        model: String,
        color: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        }
    },
    {
        collation: 'electronics',
        timestamps: true
    }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema)
};
