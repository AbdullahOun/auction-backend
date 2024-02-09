const express = require('express');
const messageController = require('../controllers/messages.controller');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.route('/:chatRoom_Id')
    .get(messageController.getAllMessages);


router.route('/:message_Id')
    .get(messageController.getMessage)
    .patch(messageController.updateMessage)
    .delete(messageController.deleteMessage);

router.route('/')
    .post(messageController.createMessage);
module.exports = router;