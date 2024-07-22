const mongoose = require('mongoose');
const Schema = mongoose.Schema;

MindGameVersions = mongoose.model('mind_game_versions', new Schema({}, { strict: false }));
MindGameUsersRecords = mongoose.model('mind_game_users_records', new Schema({}, { strict: false }));

module.exports ={
    MindGameVersions,
    MindGameUsersRecords,
};