const mongoose = require('mongoose');
const Schema = mongoose.Schema;

WordPuzzleVersions = mongoose.model('wp_versions', new Schema({}, { strict: false }));
WordPuzzleUsersRecords = mongoose.model('wp_users_records', new Schema({}, { strict: false }));
WordPuzzlePuzzlesModels = mongoose.model('wp_puzzels_models', new Schema({}, { strict: false }));

module.exports ={
    WordPuzzleVersions,
    WordPuzzleUsersRecords,
    WordPuzzlePuzzlesModels,
};
