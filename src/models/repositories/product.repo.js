'use strict';

const { product, electronic, clothing, furniture } = require('../product.modle');

const finAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
};

module.exports = { finAllDraftsForShop };
