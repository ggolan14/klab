const mongoose = require('mongoose');
const Schema = mongoose.Schema;

PrmVersions = mongoose.model('prm_versions', new Schema({}, { strict: false }));
PrmUsersRecords = mongoose.model('prm_users_records', new Schema({}, { strict: false }));

module.exports ={
    PrmVersions,
    PrmUsersRecords,
};