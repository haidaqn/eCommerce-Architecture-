const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authencation } = require('../../auth/authUtils');

router.post('/shop/signup', asyncHandler(accessController.signUp));

router.post('/shop/login', asyncHandler(accessController.login));

//   authentication

router.use(authencation);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.refreshToken));

module.exports = router;
