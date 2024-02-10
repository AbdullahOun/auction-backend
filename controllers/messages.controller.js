const { validationResult } = require('express-validator');
const Message = require('../models/message.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');


const getAllMessages = asyncWrapper(
    async(req, res,next) => {

    const messages = await Message.find({chatRoomId:req.params.chatRoom_Id},{"__v":false});
    res.json({status: "succcess", data:{messages}});
});


const getMessage = asyncWrapper(
    async(req, res,next) => {
            const message = await Message.findOne(req.params.message_Id);
            if(!message){
                const error = appError.create('Message not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{message}});
    }
);

const createMessage = asyncWrapper( 
    async (req, res,next) => {
        // req.body.senderId = req.decodedToken.id;
    const newMessage = new Message({
        chatRoomId:req.body.chatRoomId,
        content: req.body.content,
        senderId: req.decodedToken.id,
        createdAt: req.body.createdAt
    });
    await newMessage.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newMessage}});


});

const updateMessage = asyncWrapper( 
    async(req, res,next) => {
    const actionId = req.params.actionId;
        let updatedMessage = await Message.updateOne({_id:req.params.message_Id},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{updatedMessage}});

});

const deleteMessage = asyncWrapper( 
    async(req, res,next)=> {
        const chatRoom_Id = req.params.chatRoom_Id;
    const data = await Message.deleteOne({_id:req.params.message_Id});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});

module.exports = {
    getAllMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage
};