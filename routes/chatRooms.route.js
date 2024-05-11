const express = require('express')
const { Get, Create, Delete } = require('../controllers/chatRooms.controller')
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
    .get(verifyToken, Get.all)
    /**
     * POST request to create a new chat room.
     * Requires authentication.
     */
    .post(verifyToken, Create.create)

/**
 * Routes for managing a specific chat room.
 */
router
    .route('/:chatRoomId')
    /**
     * GET request to fetch a specific chat room.
     * Requires authentication.
     */
    .get(verifyToken, Get.one)
    /**
     * DELETE request to delete a specific chat room.
     * Requires authentication.
     */
    .delete(verifyToken, Delete.delete)

module.exports = router
