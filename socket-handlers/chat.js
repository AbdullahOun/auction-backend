const verifySocketToken = require('./middlewares/verifySocketToken')
const ChatRoom = require('../models/chatRoom.model')
const Message = require('../models/message.model')
const logger = require('../utils/logging/logger')
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
            const decodedId = socket.decodedToken.id
            const chatRoom = await ChatRoom.findById(chatRoomId)
            if (!chatRoom) {
                throw new Error('Chat room not found')
            }
            if (!chatRoom.user1 == decodedId && chatRoom.user2 == decodedId) {
                throw new Error('User not authorized')
            }
            socket.join(chatRoomId)
            socket.on('message', this.handleMessage)
            socket.on('disconnect', () => {
                socket.leave(chatRoomId)
            })
        } catch (error) {
            logger.log(error.message)
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
            let message = new Message({
                chatRoom: chatRoomId,
                content: data.content,
                sender: data.sender,
                seen: seen,
            })
            await message.save()
            let FinalMessage = await Message.findById(message._id)
                .populate('chatRoom')
                .populate({
                    path: 'sender',
                    select: '-password',
                })
            this.chat.to(chatRoomId).emit('message', FinalMessage)
        } catch (error) {
            logger.error(error.message)
        }
    }
}
module.exports = Chat
