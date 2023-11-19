const mongoose = require('mongoose');
const Schema = mongoose.Schema;

AbstractAndDeclarationEffectVersions = mongoose.model('ade_versions', new Schema({}, { strict: false }));
AbstractAndDeclarationEffectUsersRecords = mongoose.model('ade_users_records', new Schema({}, { strict: false }));

module.exports ={
    AbstractAndDeclarationEffectVersions,
    AbstractAndDeclarationEffectUsersRecords,
};
