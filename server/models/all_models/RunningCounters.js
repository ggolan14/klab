const mongoose = require('mongoose');
const Schema = mongoose.Schema;

RunningCounters = mongoose.model('running_counters', new Schema({}, { strict: false }));

module.exports ={
    RunningCounters,
};
