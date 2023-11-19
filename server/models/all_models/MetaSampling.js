const mongoose = require('mongoose');
const Schema = mongoose.Schema;

MetaSamplingVersions = mongoose.model('meta_sampling_versions', new Schema({}, { strict: false }));
MetaSamplingUsersRecords = mongoose.model('meta_sampling_users_records', new Schema({}, { strict: false }));

module.exports ={
    MetaSamplingVersions,
    MetaSamplingUsersRecords,
};
