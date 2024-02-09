const { validationResult } = require('express-validator');
const Image = require('../models/image.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


const getAllImages = asyncWrapper(
    async(req, res,next) => {
    const images = await Image.find({productId:req.params.product_Id},{"__v":false});
    res.json({status: "succcess", data:{images}});
});


const getImage = asyncWrapper(
    async(req, res,next) => {
            const image = await Action.findById(req.params.imageId);
            if(!image){
                const error = appError.create('Image not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{image}});
    }
);
// aloooooooooooooooooooooooooooooooooooooooo
const createImage = asyncWrapper( 
    async (req, res,next) => {
    const newImage = new Image(req.body);
    await newImage.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newImage}});


});

const updateImage = asyncWrapper( 
    async(req, res,next) => {
    const imageId = req.params.imageId;
        let updateImage = await Image.updateOne({_id:imageId},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{updateImage}});
});

const deleteImage = asyncWrapper( 
    async(req, res,next)=> {
        const imageId = req.params.imageId;
    const data = await Image.deleteOne({_id: imageId});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});

module.exports = {
    getAllImages,
    getImage,
    createImage,
    updateImage,
    deleteImage
};