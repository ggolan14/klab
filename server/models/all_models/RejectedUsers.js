const mongoose = require('mongoose');

const RejectedUsersSchema = new mongoose.Schema({
        exp: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        diff: {
            type: String,
            required: true,
        },
},
    {timestamps: true}
);

module.exports = {
    RejectedUsers: mongoose.model('rejected_users', RejectedUsersSchema)
};
