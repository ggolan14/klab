const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
//test
const ChatsSchema = new mongoose.Schema({
        exp: {
            type: String,
            required: true,
        },
        from: {
            type: String, // user_id
            required: true
        },
        m_type: {
            type: String,
            default: 'TEXT',
            enum: ['FILE', 'TEXT']
        },
        message: {
            type: String,
            required: true,
        },
        direction: {
            type: String,
            default: 'ltr',
            enum: ['ltr', 'rtl']
        },
},
    {timestamps: true}
);

module.exports = {
    Chats: mongoose.model('chats', ChatsSchema)
}
