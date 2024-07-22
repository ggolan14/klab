const mongoose = require('mongoose');
const Schema = mongoose.Schema;

MixedGameVersions = mongoose.model('mixed_game_versions', new Schema({}, { strict: false }));
MixedGameUsersRecords = mongoose.model('mixed_game_users_records', new Schema({}, { strict: false }));

module.exports ={
    MixedGameVersions,
    MixedGameUsersRecords,
};