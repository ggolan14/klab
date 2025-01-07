const mongoose = require('mongoose');
const Schema = mongoose.Schema;

DotsMindGameVersions = mongoose.model('dots_mind_game_versions', new Schema({}, { strict: false }));
DotsMindGameUsersRecords = mongoose.model('dots_mind_game_users_records', new Schema({}, { strict: false }));

module.exports ={
    DotsMindGameVersions,
    DotsMindGameUsersRecords,
};
//