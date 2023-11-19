const mongoose = require('mongoose');
const Schema = mongoose.Schema;

TryOrGiveUpVersions = mongoose.model('tog_versions', new Schema({}, { strict: false }));
TryOrGiveUpUsersRecords = mongoose.model('tog_users_records', new Schema({}, { strict: false }));

module.exports ={
    TryOrGiveUpVersions,
    TryOrGiveUpUsersRecords,
};
