'use strict';

const e = require('express');
const AccessService = require('../services/access.service');
const { CreateSuccessResponse, OK } = require('../core/success.response');
class AccessController {
    signUp = async (req, res, next) => {
        new CreateSuccessResponse({
            message: 'Create Success',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    };
}

module.exports = new AccessController();
