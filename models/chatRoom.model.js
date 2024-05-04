const mongoose = require('mongoose')
const chatRoomSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
})

module.exports = mongoose.model('ChatRoom', chatRoomSchema)
