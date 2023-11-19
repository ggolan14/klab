const mongoose = require('mongoose');

const IPListRunningSchema = new mongoose.Schema({
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
        now_date: {
            type: String,
            required: true,
        },
},
    {timestamps: true}
);

module.exports = {
    IPListRunning: mongoose.model('ip_list_run', IPListRunningSchema)
};
