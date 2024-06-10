'use strict';

const keyTokenModel = require('../models/keyToken.modle');
const { Types } = require('mongoose');

class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey, refreshToken }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userID,
            //     publicKey,
            //     privateKey
            // });

            // return tokens ? tokens?.publicKey : null;
            const filter = userID ? { user: userID } : {},
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken
                },
                options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return {
                code: 'xxx',
                messages: error.message,
                status: 'error'
            };
        }
    };

    static findByUserID = async (userID) => {
        return await keyTokenModel.findOne({
            user: new Types.ObjectId(userID)
        });
    };

    static removeKeyByID = async (id) => {
        const result = await keyTokenModel.deleteOne({
            _id: new Types.ObjectId(id)
        });
        return result;
    };

    static findByRefreshTokenUser = async (refreshToken) => {
        const result = await keyTokenModel.findOne({
            refreshTokensUsed: refreshToken
        });
        return result;
    };

    static deleteKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ user: id });
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({
            refreshToken
        });
    };
}

module.exports = KeyTokenService;
