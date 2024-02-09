const express = require('express');
const productController = require('../controllers/products.controller');
const router = express.Router();
const {validationSchema} = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');

router.route('/')
    .get( productController.getAllProducts)
    .post(validationSchema(),productController.createProduct);



router.route('/:productId')
    .get(verifyToken, productController.getProduct )
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);


module.exports = router;