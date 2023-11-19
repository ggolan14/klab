const mongoose = require('mongoose');
const Schema = mongoose.Schema;

PointsGameShVersions = mongoose.model('pg_sh_versions', new Schema({}, { strict: false }));
PointsGameShUsersRecords = mongoose.model('pg_sh_users_records', new Schema({}, { strict: false }));

module.exports ={
    PointsGameShVersions,
    PointsGameShUsersRecords,
};
