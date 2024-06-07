'use strict';

const AccessService = require('../services/access.service');
const { CreateSuccessResponse, OK, SuccessResponse } = require('../core/success.response');

class AccessController {
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

    logout = async (req, res, next) => {};
}

module.exports = new AccessController();
