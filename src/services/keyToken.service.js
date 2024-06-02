'use strict';

const keyTokenModel = require('../models/keyToken.modle');

class KeyTokenService {
    static createKeyToken = async ({ userID, publickey }) => {
        try {
            console.log(publicKeyString)
            const publicKeyString = publickey.toString();
            const tokens = await keyTokenModel.create({
                user: userID,
                publickey: publicKeyString
            });

            return tokens ? tokens.publickey : null;
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
