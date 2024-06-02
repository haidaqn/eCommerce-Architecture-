'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
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

module.exports = {
    createTokenPair
};
