const ChatRoom = require('../models/chatRoom.model')

/**
 * Repository class for handling ChatRoom operations.
 */
class ChatRoomsRepo {
    /**
     * Retrieves all chat rooms associated with a user.
     * @param {string} userId - ID of the user to retrieve chat rooms for.
     * @param {number} limit - Maximum number of chat rooms to retrieve.
     * @param {number} skip - Number of chat rooms to skip.
     * @returns {Promise<Array<Object>>} Array of chat rooms.
     */
    async getAll(userId, limit, skip) {
        const chatRooms = await ChatRoom.find({
            $or: [{ user1: userId }, { user2: userId }],
        })
            .select('-__v')
            .sort({ createdAt: -1 })
            .populate({
                path: 'user1',
                select: '-password',
            })
            .populate({
                path: 'user2',
                select: '-password',
            })
            .limit(limit)
            .skip(skip)
            .lean()

        return chatRooms
    }

    /**
     * Retrieves a chat room by its ID.
     * @param {string} chatRoomId - ID of the chat room to retrieve.
     * @returns {Promise<Object|null>} Retrieved chat room object or null if not found.
     */
    async getById(chatRoomId) {
        const chatRoom = await ChatRoom.findById(chatRoomId)
            .select('-__v')
            .populate({
                path: 'user1',
                select: '-password',
            })
            .populate({
                path: 'user2',
                select: '-password',
            })
            .lean()
        return chatRoom
    }

    /**
     * Checks if a chat room exists between two users.
     * @param {string} user1Id - ID of the first user.
     * @param {string} user2Id - ID of the second user.
     * @returns {Promise<boolean>} True if a chat room exists, false otherwise.
     */
    async isExistsByUserRefs(user1Id, user2Id) {
        const chatRoom = await ChatRoom.findOne({
            $or: [
                { user1: user1Id, user2: user2Id },
                { user1: user2Id, user2: user1Id },
            ],
        })
        return chatRoom ? true : false
    }

    /**
     * Creates a new chat room between two users.
     * @param {string} user1Id - ID of the first user.
     * @param {string} user2Id - ID of the second user.
     * @returns {Promise<Object>} Created chat room object.
     */
    async create(user1Id, user2Id) {
        const newChatRoom = new ChatRoom({
            user1: user1Id,
            user2: user2Id,
        })

        await newChatRoom.save()
        return newChatRoom
    }

    /**
     * Retrieves a chat room by its ID within a transaction session.
     * @param {string} chatRoomId - ID of the chat room to retrieve.
     * @param {Object} session - Mongoose transaction session object.
     * @returns {Promise<Object|null>} Retrieved chat room object or null if not found.
     */
    async getByIdTransaction(chatRoomId, session) {
        const chatRoom = await ChatRoom.findById(chatRoomId).session(session)
        return chatRoom
    }

    /**
     * Deletes a chat room by its ID within a transaction session.
     * @param {string} chatRoomId - ID of the chat room to delete.
     * @param {Object} session - Mongoose transaction session object.
     * @returns {Promise<Object|null>} Deleted chat room object or null if not found.
     */

    async deleteTransaction(chatRoomId, session) {
        const chatRoom = await ChatRoom.findOneAndDelete({ _id: chatRoomId }).session(session)
        return chatRoom
    }
}

module.exports = ChatRoomsRepo
