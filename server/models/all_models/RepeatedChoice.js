const mongoose = require('mongoose');
const Schema = mongoose.Schema;

RepeatedChoiceVersions = mongoose.model('rc_versions', new Schema({}, { strict: false }));
RepeatedChoiceUsersRecords = mongoose.model('rc_users_records', new Schema({}, { strict: false }));

module.exports ={
    RepeatedChoiceVersions,
    RepeatedChoiceUsersRecords,
};
