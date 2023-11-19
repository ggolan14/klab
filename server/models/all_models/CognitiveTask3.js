const mongoose = require('mongoose');
const Schema = mongoose.Schema;

CognitiveTask3Settings = mongoose.model('ct3_settings', new Schema({}, { strict: false }));
CognitiveTask3UsersRecords = mongoose.model('ct3_users_records', new Schema({}, { strict: false }));
CognitiveTask3UsersBonus = mongoose.model('ct3_users_bonus', new Schema({}, { strict: false }));
CognitiveTask3ComprehensionChecks = mongoose.model('ct3_comprehension_checks', new Schema({}, { strict: false }));

module.exports ={
    CognitiveTask3Settings,
    CognitiveTask3UsersRecords,
    CognitiveTask3UsersBonus,
    CognitiveTask3ComprehensionChecks,
};
