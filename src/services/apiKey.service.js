'use strict';

const apiKeyModel = require('../models/apiKey');

const crypto = require('crypto');

const findById = async (key) => {
    // const keyCreate = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex').toString(),
    //     status: true,
    //     permissions: ['0000']
    // });

    // console.log(keyCreate);

    const objKey = await apiKeyModel
        .findOne({
            key,
            status: true
        })
        .lean();
    return objKey;
};

module.exports = {
    findById
};
