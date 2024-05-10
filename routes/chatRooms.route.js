const express = require('express')
const chatRoomController = require('../controllers/chatRooms.controller')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

/**
 * Routes for managing chat rooms.
 */
router
    .route('/')
    /**
     * GET request to fetch all chat rooms.
     * Requires authentication.
     */
    .get(verifyToken, chatRoomController.getAllChatRooms)
    /**
     * POST request to create a new chat room.
     * Requires authentication.
     */
    .post(verifyToken, chatRoomController.createChatRoom)

/**
 * Routes for managing a specific chat room.
 */
router
    .route('/:chatRoomId')
    /**
     * GET request to fetch a specific chat room.
     * Requires authentication.
     */
    .get(verifyToken, chatRoomController.getChatRoom)
    /**
     * DELETE request to delete a specific chat room.
     * Requires authentication.
     */
    .delete(verifyToken, chatRoomController.deleteChatRoom)

module.exports = router
