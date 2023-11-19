const mongoose = require('mongoose');

const VersionChangesSchema = new mongoose.Schema({
        exp: {
            type: String,
            required: true,
            unique: true
        },
        changes: [{
            header: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                default: ''
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
},
    {timestamps: true}
);

module.exports = {
    VersionChanges: mongoose.model('version_changes', VersionChangesSchema)
};
