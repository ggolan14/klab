const mongoose = require('mongoose');
const Schema = mongoose.Schema;

NoCupsGameVersions = mongoose.model('no_cups_versions', new Schema({}, { strict: false }));
NoCupsGameUsersRecords = mongoose.model('no_cups_users_records', new Schema({}, { strict: false }));

module.exports ={
    NoCupsGameVersions,
    NoCupsGameUsersRecords,
};
