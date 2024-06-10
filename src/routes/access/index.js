const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authencation ,authenticationV2} = require('../../auth/authUtils');

router.post('/signup', asyncHandler(accessController.signUp));

router.post('/login', asyncHandler(accessController.login));

//   authentication

router.use(authenticationV2);
router.post('/logout', asyncHandler(accessController.logout));
router.post('/handlerRefreshToken', asyncHandler(accessController.refreshToken));

module.exports = router;
