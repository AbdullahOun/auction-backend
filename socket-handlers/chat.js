const verifySocketToken = require('./middlewares/verifySocketToken')
const { logger } = require('../utils/logging/logger')
const ChatRoomsRepo = require('../repos/chatRooms.repo')
const MessagesRepo = require('../repos/messages.repo')

const chatRoomsRepo = new ChatRoomsRepo()
const messagesRepo = new MessagesRepo()

class Chat {
    constructor(io) {
        this.chat = io.of('/chat')
        this.rooms = this.chat.adapter.rooms
        this.chat.use(verifySocketToken)
        this.chat.on('connection', this.handleConnection)
    }

    handleConnection = async (socket) => {
        try {
            const chatRoomId = socket.handshake.query.chatRoomId
            const userId = socket.decodedToken.id
            const chatRoom = await chatRoomsRepo.getById(chatRoomId)
            if (!chatRoom) {
                throw new Error('Chat room not found')
            }
            if (!chatRoom.user1 == userId && chatRoom.user2 == userId) {
                throw new Error('User not authorized')
            }
            socket.join(chatRoomId)
            socket.on('message', this.handleMessage)
            socket.on('disconnect', () => {
                socket.leave(chatRoomId)
            })
        } catch (err) {
            logger.error(err.message)
            socket.disconnect()
        }
    }

    handleMessage = async (data) => {
        try {
            const chatRoomId = data.chatRoomId
            let seen = false
            if (this.rooms.get(chatRoomId).size == 2) {
                seen = true
            } else {
                seen = false
            }
            const message = await messagesRepo.createAndRetrieve(chatRoomId, data.content, data.sender, seen)
            this.chat.to(chatRoomId).emit('message', message)
        } catch (err) {
            logger.error(err.message)
        }
    }
}
module.exports = Chat
