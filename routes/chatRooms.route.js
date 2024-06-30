const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const ChatRoomsController = require('../controllers/chatRooms.controller')
const ChatRoomsRepo = require('../repos/chatRooms.repo')
const MessagesRepo = require('../repos/messages.repo')
const UsersRepo = require('../repos/users.repo')

const chatRoomsRepo = new ChatRoomsRepo()
const messagesRepo = new MessagesRepo()
const usersRepo = new UsersRepo()
const chatRoomsController = new ChatRoomsController(chatRoomsRepo, messagesRepo, usersRepo)

router.route('/').get(verifyToken, chatRoomsController.getAll).post(verifyToken, chatRoomsController.create)

router
    .route('/:chatRoomId')
    .get(verifyToken, chatRoomsController.getById)
    .delete(verifyToken, chatRoomsController.delete)

module.exports = router
