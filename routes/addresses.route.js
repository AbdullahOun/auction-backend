const express = require('express');
const addressController = require('../controllers/addresses.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/')
    .get(verifyToken,addressController.getAddress)
    .patch(verifyToken,addressController.updateAddress)
    .delete(verifyToken,addressController.deleteAddress)
    .post(verifyToken,addressController.createAddress);


module.exports = router;