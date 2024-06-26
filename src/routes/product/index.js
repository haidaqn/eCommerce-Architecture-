const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);
router.post('/createProduct', asyncHandler(productController.createProduct));

router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));

module.exports = router;
