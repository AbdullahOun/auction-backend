const Message = require('../models/message.model')
const ChatRoom = require('../models/chatRoom.model')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const AppResponse = require('../utils/appResponse')
const paginate = require('../utils/paginate')
const { MODEL_MESSAGES, HTTP_STATUS_CODES } = require('../utils/constants')

class Get {
    /**
     * @descrition Get all messages in a chat room.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static all = asyncWrapper(async (req, res, next) => {
        const { limit, skip } = paginate(req)
        const chatRoomId = req.params.chatRoomId
        const decodedId = req.decodedToken.id

        const chatRoom = await ChatRoom.findById(chatRoomId)
        if (!chatRoom) {
            return next(
                new AppError(
                    MODEL_MESSAGES.chatRoom.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }

        if (!(chatRoom.user1 == decodedId || chatRoom.user2 == decodedId)) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.unauthorized,
                    HTTP_STATUS_CODES.FORBIDDEN
                )
            )
        }

        await Message.updateMany(
            { chatRoom: chatRoomId, sender: { $ne: decodedId } },
            { $set: { seen: true } }
        )

        const messages = await Message.find({ chatRoom: chatRoomId })
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('chatRoom')
            .populate({
                path: 'sender',
                select: '-password',
            })

        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse({ messages }))
    })
}

class Delete {
    /**
     * @description Delete a specific message.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static delete = asyncWrapper(async (req, res, next) => {
        const messageId = req.params.messageId
        const decodedId = req.decodedToken.id

        const message = await Message.findById(messageId)
        if (!message) {
            return next(
                new AppError(
                    MODEL_MESSAGES.message.notFound,
                    HTTP_STATUS_CODES.NOT_FOUND
                )
            )
        }

        if (message.sender != decodedId) {
            return next(
                new AppError(
                    MODEL_MESSAGES.user.unauthorized,
                    HTTP_STATUS_CODES.FORBIDDEN
                )
            )
        }

        await Message.deleteOne({ _id: messageId })
        res.status(HTTP_STATUS_CODES.OK).json(new AppResponse(null))
    })
}
module.exports = {
    Get,
    Delete,
}
