const mongoose = require('mongoose');
const Schema = mongoose.Schema;

ConsentForms = mongoose.model('consent_forms', new Schema({}, { strict: false }));

module.exports ={
    ConsentForms,
};
