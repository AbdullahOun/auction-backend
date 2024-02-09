const { validationResult } = require('express-validator');
const ChatRoom = require('../models/chatRoom.model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');



const getAllChatRooms = asyncWrapper(
    async(req, res,next) => {
    const chatRooms = await ChatRoom.find({user1:req.decodedToken.id},{"__v":false});
    res.json({status: "succcess", data:{chatRooms}});
});




const getChatRoom = asyncWrapper(
    async(req, res,next) => {
            const chatRoom = await ChatRoom.findById(req.params.chatRoomid);
            if(!chatRoom){
                const error = appError.create('ChatRoom not found', 404 ,httpStatusText.FAIL);
                return next(error);
            }
        res.json({status: httpStatusText.SUCCESS, data:{chatRoom}});
    }
);

const createChatRoom = asyncWrapper(
    async (req, res,next) => {
    const newChatRoom = new ChatRoom(req.body);
    await newChatRoom.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data:{newChatRoom}});


});

const updateChatRoom = asyncWrapper( 
    async(req, res,next) => {
    const chatRoomid = req.params.chatRoomid;
        let updateChatRoom = await ChatRoom.updateOne({_id:chatRoomid},{$set:{...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{updateChatRoom}});

});

const deleteChatRoom = asyncWrapper( 
    async(req, res,next)=> {
        const chatRoomid = req.params.chatRoomid;
    const data = await ChatRoom.deleteOne({_id: chatRoomid});
    res.status(200).json({status: httpStatusText.SUCCESS, data:null});


});

module.exports = {
    getAllChatRooms,
    getChatRoom,
    createChatRoom,
    updateChatRoom,
    deleteChatRoom
};