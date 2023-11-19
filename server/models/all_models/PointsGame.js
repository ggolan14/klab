const mongoose = require('mongoose');
const Schema = mongoose.Schema;

PointsGameVersions = mongoose.model('pg_versions', new Schema({}, { strict: false }));
PointsGameUsersRecords = mongoose.model('pg_users_records', new Schema({}, { strict: false }));

module.exports ={
    PointsGameVersions,
    PointsGameUsersRecords,
};
