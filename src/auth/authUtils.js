'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFialureError, UserNotFoundError } = require('../core/error.response');

const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('Error verifying access token', err);
            } else {
                console.log('Access token verified', decode);
            }
        });

        return {
            accessToken,
            refreshToken
        };
    } catch (err) {
        console.log('Error creating token pair', err);
        throw err; // You might want to re-throw the error to handle it at the caller's level
    }
};

const authencation = asyncHandler(async (req, res, next) => {
    /* 
        1. Check userID missing?
        2. Get accessToken
        3. Verify accessToken
        4. Check user in DB
        5. Check keyStore with this userID
        6. OK all => rutern next()
    */

    const userID = req.headers[HEADER.CLIENT_ID];
    if (!userID) throw new AuthFialureError('Invalid userID!');
    const keyStore = await KeyTokenService.findByUserID(userID);

    if (!keyStore) throw new UserNotFoundError('Not found keyStore!');

    const accessToken = req.headers[HEADER.AUTHORIZATION];

    if (!accessToken) throw new AuthFialureError('Invalid accessToken!');

    try {
        const decode = JWT.verify(accessToken, keyStore.publicKey);
        if (userID !== decode.userID) throw new AuthFialureError('Invalid User!');

        req.keyStore = keyStore;
        return next();
    } catch (error) {
        console.log('Error verifying access token');
        throw error;
    }
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    authencation,
    verifyJWT
};
