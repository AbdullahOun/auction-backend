const mongoose = require('mongoose')

/**
 * Schema definition for the ChatRoom model.
 * @typedef {import('mongoose').Schema<Document<any, any, any>, import('mongoose').Model<Document<any, any, any>>, undefined, any>} MongooseSchema
 */

/**
 * @type {MongooseSchema}
 */
const chatRoomSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                /**
                 * Asynchronous validator function to check if user1 exists.
                 * @param {mongoose.Schema.Types.ObjectId} value - The user1's ObjectId.
                 * @returns {Promise<boolean>} Whether the user1 exists.
                 */
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value)
                    return user !== null
                },
                message: 'User1 does not exist',
            },
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                /**
                 * Asynchronous validator function to check if user2 exists and is different from user1.
                 * @param {mongoose.Schema.Types.ObjectId} value - The user2's ObjectId.
                 * @returns {Promise<boolean>} Whether the user2 exists and is different from user1.
                 */
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value)
                    return user !== null && user._id != this.user1._id
                },
                message: 'User2 does not exist or cannot be the same as User1',
            },
        },
    },
    {
        timestamps: true,
    }
)

// Ensure that a combination of user1 and user2 is unique
chatRoomSchema.index({ user1: 1, user2: 1 }, { unique: true })
chatRoomSchema.index({ user2: 1, user1: 1 }, { unique: true })

module.exports = mongoose.model('ChatRoom', chatRoomSchema)
