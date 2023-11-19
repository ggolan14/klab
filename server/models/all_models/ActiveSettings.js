const mongoose = require('mongoose');
const Schema = mongoose.Schema;

ActiveSettings = mongoose.model('active_settings', new Schema({}, { strict: false }));

module.exports = {
    ActiveSettings,
};
