const mongoose = require('mongoose');
const Schema = mongoose.Schema;

SPVersions = mongoose.model('sp_versions', new Schema({}, { strict: false }));
SPUsersRecords = mongoose.model('sp_users_records', new Schema({}, { strict: false }));

module.exports ={
    SPVersions,
    SPUsersRecords,
};
