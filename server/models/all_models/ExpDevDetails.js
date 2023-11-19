const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpDevDetailsSchema = new Schema({
        exp: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: ''
        },
        version_of: {
            type: String,
            default: 'None'
        },
        status: {
            type: String,
            default: 'SENT',
            enum: ['SENT', 'DEV', 'READY', 'FREEZE', 'CANCELED']
        },
        files: [],
        date_modified: {
            type: String,
            default: ''
        },
        last_modified: {
            type: String,
            default: '-'
        },
        created_by: {
            type: String,
            required: true
        },
        date_created: {
            type: String,
            default: ''
        },
    },
    {timestamps: true},
    { strict: false }
);

ExpDevDetails = mongoose.model('exp_dev_details', ExpDevDetailsSchema);

module.exports ={
    ExpDevDetails,
};
