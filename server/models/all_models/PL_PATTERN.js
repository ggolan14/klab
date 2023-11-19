const mongoose = require('mongoose');
const Schema = mongoose.Schema;

PLPatternVersions = mongoose.model('pl_pattern_versions', new Schema({}, { strict: false }));
PLPatternRecords = mongoose.model('pl_pattern_records', new Schema({}, { strict: false }));

module.exports ={
    PLPatternVersions,
    PLPatternRecords,
};
