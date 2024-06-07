'use strict';

const AccessService = require('../services/access.service');
const { CreateSuccessResponse, OK, SuccessResponse } = require('../core/success.response');

class AccessController {
    refreshToken = async (req, res, next) => {
        new CreateSuccessResponse({
            message: 'Refresh Token Success',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new CreateSuccessResponse({
            message: 'Create Success',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    };

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login Success!',
            metadata: await AccessService.login(req.body)
        }).send(res);
    };

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success!',
            metadata: await AccessService.logout({
                keyStore: req.keyStore
            })
        }).send(res);
    };
}

module.exports = new AccessController();
