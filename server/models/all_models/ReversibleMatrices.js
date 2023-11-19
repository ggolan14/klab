const mongoose = require('mongoose');
const Schema = mongoose.Schema;

ReversibleMatricesVersions = mongoose.model('rm_versions', new Schema({}, { strict: false }));
ReversibleMatricesUsersRecords = mongoose.model('rm_users_records', new Schema({}, { strict: false }));

module.exports ={
    ReversibleMatricesVersions,
    ReversibleMatricesUsersRecords,
};
