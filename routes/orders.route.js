const express = require('express');
const orderController = require('../controllers/orders.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/')
    .get(verifyToken,orderController.getAllOrder)
    .post(verifyToken,orderController.createOrder);



router.route('/:orderId')
    .get(verifyToken,orderController.getOrder)
    .patch(verifyToken,orderController.updateOrder)
    .delete(verifyToken,orderController.deleteOrder);


module.exports = router;