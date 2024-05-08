const mongoose = require('mongoose');
const Schema = mongoose.Schema;

TriviaVersions = mongoose.model('trivia_versions', new Schema({}, { strict: false }));
TriviaUsersRecords = mongoose.model('trivia_users_records', new Schema({}, { strict: false }));

module.exports ={
    TriviaVersions,
    TriviaUsersRecords,
};
