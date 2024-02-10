const { validationResult } = require('express-validator');
const Auction = require('../models/auction.model');
const Product = require('../models/product.model');
const Image = require('../models/image.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
// const jwt = require('jsonwebtoken');


const getAllAuctions = asyncWrapper(
    async(req, res,next) => {
    const limit = req.query.limit || 6;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const auctions = await Auction.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({status: "succcess", data:{auctions}});
});


const getAllAuctionsForUser = asyncWrapper(
    async(req, res,next) => {

    const auctions = await Auction.find({sellerId: req.decodedToken.id},{"__v":false});
    res.json({status: "succcess", data:{auctions}});
});

const getAction = asyncWrapper(
    async(req, res,next) => {
        // ,_id:req.params.actionId
            const action = await Action.findOne({productId:req.params.product_Id});
            if(!action){
                const error = appError.create('Action not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{action}});
    }
);
// aloooooooooooooooooooooooooooooooooooooooo
const createAction = asyncWrapper( 
    async (req, res,next) => {

    const productup = {
        name: req.body.name,
        initialPrice: req.body.initialPrice,
        maxPrice: req.body.maxPrice,
        quantity: req.body.quantity,
        description: req.body.description,
        categoryId: req.body.categoryId
    }
    let newProduct = new Product(productup);
    await newProduct.save();

    const imageup = req.files;
    // console.log(imageup);
    // const newImage = new Image({productId:newProduct._id,url:imageup.filename});
    for (let i = 0; i < imageup.length; i++) {
        const newImage = new Image({productId:newProduct._id,url:imageup[i].filename});
        await newImage.save();
    }
//     const authHeader = req.headers['Authorization'] || req.headers['authorization'];
//     const token = authHeader.split(' ')[1];
//     const _decodedToken = await jwt.verify(token,process.env.JWT_SECRET_KEY);
// console.log(`decoded token: ${_decodedToken}`);
        const auctionup = {
            startdate: req.body.startdate,
            enddate:req.body.enddate,
            productId:newProduct._id,
            price:req.body.maxPrice,
            sellerId: req.decodedToken.id
        }

    const newAction = new Auction(auctionup);
    await newAction.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newAction}});


});

const updateAction = asyncWrapper( 
    async(req, res,next) => {
    const actionId = req.params.actionId;
        let updateAction = await Action.updateOne({_id:actionId},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{updateAction}});

});

const deleteAction = asyncWrapper( 
    async(req, res,next)=> {
        const actionId = req.params.actionId;
    const data = await Auction.deleteOne({_id: actionId});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});

module.exports = {
    getAllAuctions,
    getAction,
    createAction,
    updateAction,
    deleteAction,
    getAllAuctionsForUser
};