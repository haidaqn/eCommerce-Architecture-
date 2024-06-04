'use strict';

const { findById } = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY];
        if (!key) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const objKey = await findById(key);

        if (!objKey) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        req.objKey = objKey;

        return next();
    } catch (err) {}
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({ message: 'permission dinied' });
        }

        const validPermission = req.objKey.permissions.includes(permission);

        if (!validPermission) {
            return res.status(403).json({ message: 'permission dinied' });
        }

        return next();
    };
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = {
    apiKey,
    permission,
    asyncHandler
};
