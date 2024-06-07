'use strict';

const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.modle');
const KeyTokenService = require('./keyToken.service');
const { findByEmail } = require('./shop.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFialureError, ForbiddenError } = require('../core/error.response');
const generateToken = require('../utils/generateToken');
const { verifyJWT } = require('../auth/authUtils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

class AccessService {
    static handlerRefreshToken = async (refreshToken) => {

        const foundToken = await KeyTokenService.findByRefreshTokenUser(refreshToken);
        if (foundToken) {
            const { userID, email } = await verifyJWT(refreshToken, foundToken.privateKey);

            await KeyTokenService.deleteKeyById(userID);

            throw new ForbiddenError('Something warning happed!! Pls relogin');
        }
        
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

        if (!holderToken) {
            throw new AuthFialureError('Error: Refresh token not found!');
        }

        // verify token
        const { userID, email } = await verifyJWT(refreshToken, holderToken.privateKey);

        const foundShop = await findByEmail({ email });

        if (!foundShop) throw new AuthFialureError('Error: Shop not register!');
        // cap token moi
        const tokens = await createTokenPair(
            {
                userID,
                email
            },
            holderToken.publicKey,
            holderToken.privateKey
        );

        // update token

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });

        return {
            user: {
                userID,
                email
            },
            tokens
        };
    };

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

    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyByID(keyStore._id);
        return delKey;
    };

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
