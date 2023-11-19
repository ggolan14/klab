const mongoose = require('mongoose');
const Schema = mongoose.Schema;

CupsGameVersions = mongoose.model('cups_versions', new Schema({}, { strict: false }));
CupsGameUsersRecords = mongoose.model('cups_users_records', new Schema({}, { strict: false }));

module.exports ={
    CupsGameVersions,
    CupsGameUsersRecords,
};
