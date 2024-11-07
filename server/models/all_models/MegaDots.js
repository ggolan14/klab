const mongoose = require('mongoose');
const Schema = mongoose.Schema;

MegaDotsVersions = mongoose.model('mega_dots_versions', new Schema({}, { strict: false }));
MegaDotsUsersRecords = mongoose.model('mega_dots_users_records', new Schema({}, { strict: false }));

module.exports ={
    MegaDotsVersions,
    MegaDotsUsersRecords,
};
//