'use strict';

const { model } = require('mongoose');

const StatusCode = {
    Ok: 200,
    CREATE: 201
};

const ReasonStatusCode = {
    Ok: 'Success',
    CREATE: 'Create Success'
};

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.Ok, reasonStatusCode = ReasonStatusCode.Ok, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({
            message,
            metadata
        });
    }
}

class CreateSuccessResponse extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATE, reasonStatusCode = ReasonStatusCode.CREATE, metadata }) {
        super({
            message,
            statusCode,
            reasonStatusCode,
            metadata
        });
    }
}

module.exports = { OK, CreateSuccessResponse };
