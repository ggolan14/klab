const mongoose = require('mongoose');
const Schema = mongoose.Schema;

SignatureTimingEffectVersions = mongoose.model('ste_versions', new Schema({}, { strict: false }));
SignatureTimingEffectUsersRecords = mongoose.model('ste_users_records', new Schema({}, { strict: false }));

module.exports ={
    SignatureTimingEffectVersions,
    SignatureTimingEffectUsersRecords,
};
