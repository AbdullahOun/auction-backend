const mongoose = require('mongoose');
const chatRoomSchema = new mongoose.Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user2:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }


})


module.exports = mongoose.model('ChatRoom',chatRoomSchema);