const mongoose = require('mongoose');
const Schema = mongoose.Schema;

CognitiveTaskVersions = mongoose.model('ct_versions', new Schema({}, { strict: false }));
CognitiveTaskUsersRecords = mongoose.model('ct_users_records', new Schema({}, { strict: false }));

module.exports = {
    CognitiveTaskVersions,
    CognitiveTaskUsersRecords,
};
