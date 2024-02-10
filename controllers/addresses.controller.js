const { validationResult } = require('express-validator');
const Address = require('../models/address.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


const getAddress = asyncWrapper(
    async(req, res,next) => {
            const address = await Address.findOne({userId:req.decodedToken.id});
            if(!address){
                const error = appError.create('Address not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{address}});
    }
);

const createAddress = asyncWrapper( 
    async (req, res) => {
    const newAddress = new Address({
        country:req.body.country,
        city:req.body.city,
        street:req.body.street,
        houseNumber:req.body.houseNumber,
        userId:req.decodedToken.id
    });
    await newAddress.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newAddress}});


});

const updateAddress = asyncWrapper( 
    async(req, res,next) => {
    const user_Id = req.decodedToken.id;
        let updateAddress = await Address.updateOne({userId:user_Id},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{updateAddress}});

});

const deleteAddress = asyncWrapper( 
    async(req, res,next)=> {
        const user_Id = req.decodedToken.id;
    const data = await Address.deleteOne({userId: user_Id});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});

module.exports = {
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress
};