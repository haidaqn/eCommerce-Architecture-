'use strict';

const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const shopModel = require('../models/shop.modle');
const KeyTokenService = require('./keyToken.service');
const { findByEmail } = require('./shop.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, ConflictRequestError, AuthFialureError } = require('../core/error.response');
const generateToken = require('../utils/generateToken');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Error: Shop not found!');
        }

        const match = await bcrypt.compare(password, foundShop.password);

        if (!match) throw new AuthFialureError('Error: Authencaition error!');
        // generate token
        const { publicKey, privateKey } = generateToken();

        const tokens = await createTokenPair(
            {
                userID: foundShop._id,
                email
            },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
            userID: foundShop._id
        });

        return {
            shop: getInfoData({
                filter: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        };
    };

    static logout = async () => {};

    static signUp = async ({ name, email, password }) => {
        try {
            const hodelShop = await shopModel.findOne({ email }).lean();

            if (hodelShop) {
                throw new BadRequestError('Error: Shop already registered!');
            }
            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            });

            if (newShop) {
                // const privateKey = crypto.randomBytes(64).toString('hex');
                // const publicKey = crypto.randomBytes(64).toString('hex');

                const { publicKey, privateKey } = generateToken();

                const keyStore = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore) {
                    // throw new BadRequestError('Error: Shop already registered!');
                    return {
                        code: 'xxx',
                        messages: 'Error create public key',
                        status: 'error'
                    };
                }

                const tokens = await createTokenPair(
                    {
                        userID: newShop._id,
                        email
                    },
                    publicKey,
                    privateKey
                );

                return { shop: getInfoData({ filter: ['_id', 'name', 'email'], object: newShop }), tokens };
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
