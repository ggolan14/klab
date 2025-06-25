const mongoose = require('mongoose');
const Schema = mongoose.Schema;

DotsMindGameBenchmarkVersions = mongoose.model('dots_mind_game_benchmark_versions', new Schema({}, { strict: false }));
DotsMindGameBenchmarkUsersRecords = mongoose.model('dots_mind_game_benchmark_users_records', new Schema({}, { strict: false }));

module.exports ={
    DotsMindGameBenchmarkVersions,
    DotsMindGameBenchmarkUsersRecords,
};