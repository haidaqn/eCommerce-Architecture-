'use strict';

const { Schema, model } = require('mongoose');

const DOCUTMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop'
        },
        publicKey: {
            type: String,
            required: true
        },
        privateKey: {
            type: String,
            required: true
        },
        refreshTokensUsed: {
            type: Array,
            default: []
        },
        refreshToken: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

module.exports = model(DOCUTMENT_NAME, keyTokenSchema);
