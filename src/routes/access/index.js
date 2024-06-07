const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
