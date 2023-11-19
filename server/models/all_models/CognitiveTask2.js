const mongoose = require('mongoose');
const Schema = mongoose.Schema;

CognitiveTask2Versions = mongoose.model('ct2_versions', new Schema({}, { strict: false }));
CognitiveTask2UsersRecords = mongoose.model('ct2_users_records', new Schema({}, { strict: false }));

module.exports ={
    CognitiveTask2Versions,
    CognitiveTask2UsersRecords,
};
