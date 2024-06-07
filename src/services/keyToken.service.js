'use strict';

const keyTokenModel = require('../models/keyToken.modle');

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
}

module.exports = KeyTokenService;
