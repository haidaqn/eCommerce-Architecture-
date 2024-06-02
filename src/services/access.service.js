'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModle = require('../models/shop.modle');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { format } = require('path');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const hodelShop = await shopModle.findOne({ email }).lean();

            if (hodelShop) {
                return {
                    code: 'xxx',
                    messages: 'Shop already registered',
                    status: 'error'
                };
            }
            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModle.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            });

            if (newShop) {
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                });


                const publicKeyString = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey 
                });

                console.log(publicKeyString)

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        messages: 'Error create public key',
                        status: 'error'
                    };
                }

                const publicKeyObject = await crypto.createPublicKey(publicKeyString);

                //  create token pair

                const tokens = await createTokenPair(
                    {
                        userID: newShop._id,
                        email
                    },
                    publicKeyObject,
                    privateKey
                );

                console.log(tokens);

                return {
                    code: 201,
                    metadata: { shop: newShop, tokens }
                };
            }

            return {
                code: 200,
                metadata: null
            };
        } catch (error) {
            return {
                code: 'xxxx',
                messages: error.message,
                status: 'error'
            };
        }
    };
}

module.exports = AccessService;
