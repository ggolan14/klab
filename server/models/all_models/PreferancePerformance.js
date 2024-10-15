const mongoose = require('mongoose');
const Schema = mongoose.Schema;

PreferancePerformanceVersions = mongoose.model('preferance_performance_versions', new Schema({}, { strict: false }));
PreferancePerformanceUsersRecords = mongoose.model('preferance_performance_users_records', new Schema({}, { strict: false }));

module.exports ={
    PreferancePerformanceVersions,
    PreferancePerformanceUsersRecords,
};