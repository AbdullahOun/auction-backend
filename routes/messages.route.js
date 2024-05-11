const express = require('express')
const { Get, Delete } = require('../controllers/messages.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

router
    .route('/chat-rooms/:chatRoomId')
    /**
     * GET request to fetch all messages for a specific chat room.
     * Requires authentication.
     */
    .get(verifyToken, Get.all)

router
    .route('/:messageId')
    /**
     * DELETE request to delete a specific message.
     * Requires authentication.
     */
    .delete(verifyToken, Delete.delete)

module.exports = router
