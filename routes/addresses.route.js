const express = require('express');
const addressController = require('../controllers/addresses.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/:user_Id')
    .get(addressController.getAddress)
    .patch(addressController.updateAddress)
    .delete(addressController.deleteAddress)
    .post(addressController.createAddress);


module.exports = router;