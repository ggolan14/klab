const mongoose = require('mongoose');
const Schema = mongoose.Schema;

SignatureAsReminderVersions = mongoose.model('sar_versions', new Schema({}, { strict: false }));
SignatureAsReminderUsersRecords = mongoose.model('sar_users_records', new Schema({}, { strict: false }));

module.exports ={
    SignatureAsReminderVersions,
    SignatureAsReminderUsersRecords,
};
