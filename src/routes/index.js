'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/checkAuth');

// check apikey
router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api/shop', require('./access'));
router.use('/v1/api/product', require('./product'));


module.exports = router;
