const mongoose = require('mongoose');
const Schema = mongoose.Schema;

QueenGarden2Versions = mongoose.model('qg_versions_2', new Schema({}, { strict: false }));
QueenGarden2UsersRecords = mongoose.model('qg_users_records_2', new Schema({}, { strict: false }));

module.exports ={
    QueenGarden2Versions,
    QueenGarden2UsersRecords,
};
