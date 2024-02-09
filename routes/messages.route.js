const express = require('express');
const messageController = require('../controllers/messages.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/:chatRoom_Id')
    .get(verifyToken,messageController.getAllMessages);


router.route('/:message_Id')
    .get(verifyToken,messageController.getMessage)
    .patch(verifyToken,messageController.updateMessage)
    .delete(verifyToken,messageController.deleteMessage);

router.route('/')
    .post(verifyToken,messageController.createMessage);
module.exports = router;