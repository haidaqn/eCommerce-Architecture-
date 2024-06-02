'use strict';

const keyTokenModel = require('../models/keyToken.modle');

class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey }) => {
        try {
            const tokens = await keyTokenModel.create({
                user: userID,
                publicKey,
                privateKey
            });

            return tokens ? tokens?.publicKey : null;
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
