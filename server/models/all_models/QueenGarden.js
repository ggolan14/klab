const mongoose = require('mongoose');
const Schema = mongoose.Schema;

QueenGardenVersions = mongoose.model('qg_versions', new Schema({}, { strict: false }));
QueenGardenUsersRecords = mongoose.model('qg_users_records', new Schema({}, { strict: false }));

module.exports ={
    QueenGardenVersions,
    QueenGardenUsersRecords,
};
