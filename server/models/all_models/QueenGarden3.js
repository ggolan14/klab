const mongoose = require('mongoose');
const Schema = mongoose.Schema;

QueenGarden3Versions = mongoose.model('qg_versions_3', new Schema({}, { strict: false }));
QueenGarden3UsersRecords = mongoose.model('qg_users_records_3', new Schema({}, { strict: false }));

module.exports ={
    QueenGarden3Versions,
    QueenGarden3UsersRecords,
};
