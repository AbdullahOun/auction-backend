const { validationResult } = require('express-validator');
const Product = require('../models/product.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
// const imageController = require('../controllers/images.controller');
// const Image = require('../models/image.model');


const getAllProducts = asyncWrapper(
    async(req, res,next) => {
    // const query = req.query;
    const limit = req.query.limit || 6;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const products = await Product.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({status: "succcess", data:{products}});


});

const getProduct = asyncWrapper(
    async(req, res,next) => {
            const product = await Product.findById(req.params.productId);
            if(!product){
                const error = appError.create('Product not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{product}});
    }
);

const createProduct = asyncWrapper( 
    async (req, res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(),400,httpStatusText.FAIL);
        return next(error);
    }


    const newProduct = new Product(req.body);
    await newProduct.save();
    

    // const newImage = new Image(req.body);

    // imageController.createImage(req.body);
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newProduct}});


});

const updateProduct = asyncWrapper( 
    async(req, res,next) => {
    const productId = req.params.productId;
        let updateProduct = await Product.updateOne({_id:productId},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{updateProduct}});
});

const deleteProduct = asyncWrapper( 
    async(req, res,next)=> {
    const productId = req.params.productId;
    // }

    // products = products.filter((product)=>product.id!==productId);
    // res.status(200).json(products);
    const data = await Product.deleteOne({_id: productId});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});


module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};