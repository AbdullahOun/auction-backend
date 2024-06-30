const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const ChatRoomsRepo = require('../repos/chatRooms.repo')
const MessagesRepo = require('../repos/messages.repo')
const MessagesController = require('../controllers/messages.controller')

const messagesRepo = new MessagesRepo()
const chatRoomsRepo = new ChatRoomsRepo()
const messagesController = new MessagesController(messagesRepo, chatRoomsRepo)

router.route('/chat-rooms/:chatRoomId').get(verifyToken, messagesController.getAll)
router.route('/:messageId').delete(verifyToken, messagesController.delete)

module.exports = router
