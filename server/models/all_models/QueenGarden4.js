const mongoose = require('mongoose');
const Schema = mongoose.Schema;

QueenGarden4Versions = mongoose.model('preferance_performance_versions', new Schema({}, { strict: false }));
QueenGarden4UsersRecords = mongoose.model('preferance_performance_users_records', new Schema({}, { strict: false }));

module.exports ={
    QueenGarden4Versions,
    QueenGarden4UsersRecords,
};
