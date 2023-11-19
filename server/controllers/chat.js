const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');
const {getConnectionsHandle} = require("../Struct/users_list");

const ChatsModel = getModelPack('Chats').Chats;

// @desc    Create new Chat line
// @route   POST /api/chat
// @access  Private
const addChat = asyncHandler(async (req, res) => {

    try {
        const {
            exp, from, message, m_type, direction
        } = req.body

        let new_chat = new ChatsModel({
            exp, from, message, m_type, direction
        });

        await new_chat.save();

        let connections_handle = getConnectionsHandle();

        connections_handle.broadcastToRoom(exp, 'NEW_CHAT_MSG', new_chat);

        res.json({success: true})
    }
    catch (e) {
        res.json({success: false})
    }
})

// @desc    Get Chat
// @route   GET /api/chat/
// @access  Private
const getChat = asyncHandler(async (req, res) => {

    const {exp} = req.params;

    let chat = await ChatsModel.findOne({exp});

    if (chat) {
        res.json({exp_chat: chat});
    } else {
        return res.json({error: 'Chat not found'});
    }
});

module.exports = {
    addChat,
    getChat,
}
