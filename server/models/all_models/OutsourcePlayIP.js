const mongoose = require('mongoose');

const OutsourcePlayIPSchema = new mongoose.Schema({
        exp: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['REDIRECT', 'LOGIN']
        },
        userId: {
            type: String,
            default: '-'
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
},
    {timestamps: true}
);

module.exports = {
    OutsourcePlayIP: mongoose.model('out_source_ip', OutsourcePlayIPSchema)
};
