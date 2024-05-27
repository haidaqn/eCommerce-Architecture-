const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { checkOverLoad } = require('./helpers/check.connect');
//
const app = express();

// init middleware
app.use(morgan('dev')); // log req
app.use(helmet());
app.use(compression());

// init db

require('./dbs/init.mongoDB');
checkOverLoad()
// init routes

module.exports = app;
