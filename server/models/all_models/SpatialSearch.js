const mongoose = require('mongoose');
const Schema = mongoose.Schema;

SpatialSearchVersions = mongoose.model('spatial_search_versions', new Schema({}, { strict: false }));
SpatialSearchUsersRecords = mongoose.model('spatial_search_users_records', new Schema({}, { strict: false }));

module.exports ={
    SpatialSearchVersions,
    SpatialSearchUsersRecords,
};
