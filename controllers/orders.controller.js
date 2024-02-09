const { validationResult } = require('express-validator');
const Order = require('../models/order.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


const getOrder = asyncWrapper(
    async(req, res,next) => {
            const order = await Order.findById(req.params.orderId);
            if(!order){
                const error = appError.create('Order not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{order}});
    }
);

const createOrder = asyncWrapper( 
    async (req, res,next) => {
        
        const newOrder = new Order({price:req.body.price, productId:req.body.productId, buyerId:req.decodedToken.id, sellerId:req.body.sellerId});
        await newOrder.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newOrder}});
});

const updateOrder = asyncWrapper( 
    async(req, res,next) => {
    const orderId = req.params.orderId;
    let updateOrder = await Order.updateOne({_id:orderId},{$set:{...req.body}});
    return res.status(200).json({status: httpStatusText.SUCCESS, data:{updateOrder}});


});

const deleteOrder = asyncWrapper( 
    async(req, res,next)=> {
    const orderId = req.params.orderId;
    const data = await Order.deleteOne({_id: orderId});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});


module.exports = {
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
};