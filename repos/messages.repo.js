const Message = require('../models/message.model')

/**
 * Repository class for handling Message operations.
 */
class MessagesRepo {
    /**
     * Retrieves all messages in a chat room.
     * @param {string} chatRoomId - ID of the chat room to retrieve messages from.
     * @param {number} limit - Maximum number of messages to retrieve.
     * @param {number} skip - Number of messages to skip.
     * @returns {Promise<Array<Object>>} Array of messages.
     */
    async getAll(chatRoomId, limit, skip) {
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
        return messages
    }

    /**
     * Deletes a message by its ID if the sender matches.
     * @param {string} messageId - ID of the message to delete.
     * @param {string} senderId - ID of the sender trying to delete the message.
     * @returns {Promise<Object|null>} Deleted message object or null if not found.
     */
    async delete(messageId, senderId) {
        const message = Message.findOneAndDelete({ _id: messageId, sender: senderId })
        return message
    }

    /**
     * Retrieves the count of unseen messages for a user in a chat room.
     * @param {string} chatRoomId - ID of the chat room to check.
     * @param {string} userId - ID of the user.
     * @returns {Promise<number>} Number of unseen messages.
     */
    async getUnseenCount(chatRoomId, userId) {
        const unseenCount = await Message.countDocuments({
            chatRoom: chatRoomId,
            seen: false,
            sender: { $ne: userId },
        })
        return unseenCount
    }

    /**
     * Deletes all messages in a chat room within a transaction session.
     * @param {string} chatRoomId - ID of the chat room to delete messages from.
     * @param {Object} session - Mongoose transaction session object.
     */
    async deleteAllByRoomIdTransaction(chatRoomId, session) {
        await Message.deleteMany({ chatRoom: chatRoomId }).session(session)
    }

    /**
     * Marks all messages in a chat room as seen for a specific user.
     * @param {string} chatRoomId - ID of the chat room to mark messages as seen.
     * @param {string} userId - ID of the user whose messages are being marked as seen.
     */
    async markAsSeen(chatRoomId, userId) {
        await Message.updateMany({ chatRoom: chatRoomId, sender: { $ne: userId } }, { $set: { seen: true } })
    }

    /**
     * Creates a new message in a chat room and retrieves the created message object.
     * @param {string} chatRoomId - ID of the chat room where the message is created.
     * @param {string} content - Content of the message.
     * @param {string} sender - ID of the user sending the message.
     * @param {boolean} seen - Whether the message is seen by the recipient.
     * @returns {Promise<Object>} Created message object.
     */
    async createAndRetrieve(chatRoomId, content, sender, seen) {
        const message = new Message({
            chatRoom: chatRoomId,
            content: content,
            sender: sender,
            seen: seen,
        })
        await message.save()
        const FinalMessage = await Message.findById(message._id.toString()).populate('chatRoom').populate({
            path: 'sender',
            select: '-password',
        })
        return FinalMessage
    }

    /**
     * Retrieves the total number of messages and pages in a chat room.
     * @param {string} chatRoomId - ID of the chat room to count messages for.
     * @param {number} limit - Maximum number of messages per page.
     * @param {number} skip - Number of messages to skip.
     * @returns {Promise<Object>} Object containing total message count and total pages.
     */
    async getPagesCount(chatRoomId, limit, skip) {
        const totalCount = await Message.countDocuments({ chatRoom: chatRoomId })

        const totalPages = Math.ceil(totalCount / limit)

        return {
            totalMessages: totalCount,
            totalPages: totalPages,
        }
    }
}

module.exports = MessagesRepo
