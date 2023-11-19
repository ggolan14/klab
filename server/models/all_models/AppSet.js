const mongoose = require('mongoose');

const AppSettingsSchema = new mongoose.Schema({
        set_key: {
            type: String,
            required: true,
            unique: true,
        },
    data: {

    }
},
    {timestamps: true, minimize: false}
);

module.exports = {
    AppSettings: mongoose.model('app_set', AppSettingsSchema)
};
