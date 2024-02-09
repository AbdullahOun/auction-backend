const express = require('express');
const auctionController = require('../controllers/auctions.controller');
const router = express.Router();
// const {validationSchema} = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');

const multer = require('multer') ;

const diskStorage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/')
    },
    filename: function (req,file,cb){
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now() + Math.round(Math.random() * 1E9)}.${ext}`;
        cb(null,fileName);
    }
})

const fileFilter = (req,file,cb) => {
    const imageType = file.mimetype.split('/')[0];

    if(imageType === 'image'){
    return cb(null,true);
    }else{
        const error = appError.create('Only images are allowed',400,httpStatusText.FAIL);
        return cb(error,false);
    }

}


const upload = multer({
    storage: diskStorage,
    fileFilter});




router.route('/')
    .get(auctionController.getAllAuctions)
    .post(verifyToken,upload.array('images',3),auctionController.createAction);



router.route('/:auctionId')
    .patch(auctionController.updateAction)
    .delete(auctionController.deleteAction);

router.route('/:product_Id')
    .get(auctionController.getAction);

module.exports = router;