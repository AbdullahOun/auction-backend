const express = require('express')
const messageController = require('../controllers/messages.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

router
    .route('/')
    /**
     * POST request to create a new message.
     * Requires authentication.
     */
    .post(verifyToken, messageController.createMessage)

router
    .route('/chat-rooms/:chatRoomId')
    /**
     * GET request to fetch all messages for a specific chat room.
     * Requires authentication.
     */
    .get(verifyToken, messageController.getAllMessages)

router
    .route('/:messageId')
    /**
     * DELETE request to delete a specific message.
     * Requires authentication.
     */
    .delete(verifyToken, messageController.deleteMessage)

module.exports = router
