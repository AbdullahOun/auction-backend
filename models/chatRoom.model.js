const mongoose = require('mongoose')

/**
 * Schema for the ChatRoom model.
 */
const chatRoomSchema = new mongoose.Schema({
    /**
     * The first user in the chat room.
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     * @ref User
     * @validate Custom validator to check if user1 exists in the User collection
     */
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value)
                return user !== null
            },
            message: 'User1 does not exist',
        },
    },
    /**
     * The second user in the chat room.
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     * @ref User
     * @validate Custom validator to check if user2 exists in the User collection
     */
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value)
                return user !== null && user._id != this.user1._id
            },
            message: 'User2 does not exist',
        },
    },
})

// Ensure that a combination of user1 and user2 is unique
chatRoomSchema.index({ user1: 1, user2: 1 }, { unique: true })
chatRoomSchema.index({ user2: 1, user1: 1 }, { unique: true })

module.exports = mongoose.model('ChatRoom', chatRoomSchema)
