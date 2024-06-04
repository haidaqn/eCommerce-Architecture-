'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
};

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden error',
    CONFLICT: 'Conflict error'
};

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message); // truyen ve cho th cha laf Error
        this.statusCode = statusCode;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
};
