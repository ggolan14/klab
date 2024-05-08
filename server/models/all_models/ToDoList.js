const mongoose = require('mongoose');

const ToDoListSchema = new mongoose.Schema({
        exp: {
            type: String,
            required: true,
        },
        open_by: {
            type: String,
            //required: true
        },
        subject: {
            type: String,
            //required: true,
        },
        description: {
            type: String,
            default: ''
        },
        direction: {
            type: String,
            default: 'ltr',
            enum: ['ltr', 'rtl']
        },
        files: [],
        status: {
            type: String,
            default: 'SENT',
            enum: ['SENT', 'ACCEPT', 'DEV', 'DONE', 'FREEZE', 'CANCELED']
        },
},
    {timestamps: true}
);

module.exports = {
    ToDoList: mongoose.model('todo', ToDoListSchema)
};
