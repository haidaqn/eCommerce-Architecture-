'use strict';

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';

const shopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            trim: true,
            maxLen: 150
        },
        password: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        verfify: {
            type: Boolean,
            default: false
        },
        roles: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);


module.exports = model(DOCUMENT_NAME, shopSchema);