const express = require('express');
const chatRoomController = require('../controllers/chatRooms.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/:chatRoomid')
    .get(chatRoomController.getChatRoom)
    .patch(chatRoomController.updateChatRoom)
    .delete(chatRoomController.deleteChatRoom);



router.route('/')
    .get(verifyToken,chatRoomController.getAllChatRooms)
    .post(chatRoomController.createChatRoom);


module.exports = router;