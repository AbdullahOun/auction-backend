const { validationResult } = require('express-validator');
const Bid = require('../models/bid.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


const getAllBids = asyncWrapper(
    async(req, res,next) => {

    const bids = await Bid.find({auctionId:req.params.auction_Id},{"__v":false});
    res.json({status: "succcess", data:{bids}});
});


const getBid = asyncWrapper(
    async(req, res,next) => {
            const bid = await Action.findById(req.params.bidId);
            if(!bid){
                const error = appError.create('Bid not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{bid}});
    }
);

const createBid = asyncWrapper( 
    async (req, res) => {
    const newBid = new Bid({
        auctionId: req.body.auctionId,
        price:req.body.price,
        buyerId:req.decodedToken.id
    });
    await newBid.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newBid}});


});



const deleteBid = asyncWrapper( 
    async(req, res,next)=> {
        const bidId = req.params.bidId;
    const data = await Bid.deleteOne({_id: bidId});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});

module.exports = {
    getAllBids,
    getBid,
    createBid,
    deleteBid
};