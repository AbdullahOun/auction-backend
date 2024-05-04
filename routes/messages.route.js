const express = require('express')
const messageController = require('../controllers/messages.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
router
    .route('/chat-rooms/:chatRoomId')
    .get(verifyToken, messageController.getAllMessages)

router.route('/').post(verifyToken, messageController.createMessage)

router.route('/:messageId').delete(verifyToken, messageController.deleteMessage)

module.exports = router
