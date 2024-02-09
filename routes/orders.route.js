const express = require('express');
const orderController = require('../controllers/orders.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/')
    .post(orderController.createOrder);



router.route('/:orderId')
    .get(orderController.getOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);


module.exports = router;