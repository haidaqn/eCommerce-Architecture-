const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const {
    checkOverLoad
} = require('./helpers/check.connect');

const app = express();

app.use(express.json()); // Middleware để phân tích JSON
app.use(express.urlencoded({
    extended: true
})); // Middleware để phân tích URL-encoded data

// init middleware
app.use(morgan('dev')); // Log request
app.use(helmet()); // Bảo mật HTTP headers
app.use(compression()); // Nén response

// init db
require('./dbs/init.mongoDB');
// checkOverLoad();

// init routes
app.use(require('./routes'));

module.exports = app;
