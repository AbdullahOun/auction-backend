const express = require('express');
const imageController = require('../controllers/images.controller');
const router = express.Router();
const {validationSchema} = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');

router.route('/:product_Id')
    .get(imageController.getAllImages)
    .post(imageController.createImage);



router.route('/:imageId')
    .get(imageController.getImage)
    .patch(imageController.updateImage)
    .delete(imageController.deleteImage);


module.exports = router;