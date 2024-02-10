const express = require('express');
const chatRoomController = require('../controllers/chatRooms.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/:chatRoomid')
    .get(verifyToken,chatRoomController.getChatRoom)
    .patch(verifyToken,chatRoomController.updateChatRoom)
    .delete(verifyToken,chatRoomController.deleteChatRoom);



router.route('/')
    .get(verifyToken,chatRoomController.getAllChatRooms)
    .post(verifyToken,chatRoomController.createChatRoom);


module.exports = router;