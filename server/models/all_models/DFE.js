const mongoose = require('mongoose');
const Schema = mongoose.Schema;

DFEVersions = mongoose.model('dfe_versions', new Schema({}, { strict: false }));
DFEUsersRecords = mongoose.model('dfe_users_records', new Schema({}, { strict: false }));

module.exports ={
    DFEVersions,
    DFEUsersRecords,
};
