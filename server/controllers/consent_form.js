const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');
const Logger = require("../logger");

const consentFormModel = getModelPack('ConsentForms').ConsentForms;

// @desc    Create new Consent Form
// @route   POST /api/consent_form
// @access  Private
const addConsentForm = asyncHandler(async (req, res) => {
    const {
        exp, version, consent_form, user_id
    } = req.body

    let consentForm = await consentFormModel.findOne({exp});

    if (consentForm){
        res.status(400);
        return res.json({error: 'Consent exist'});
    }
    else {
        consentForm = new consentFormModel({
            exp, version, consent_form, last_modified: user_id, date_modified: getTimeDate().date
        });

        const c_form = await consentForm.save();
        res.status(201).json(c_form);
    }
})

// @desc    Get Consent Form
// @route   GET /api/consent_form/
// @access  Private
const getConsentForm = asyncHandler(async (req, res) => {
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {exp, version} = req.params;

    try {
        let model_pack = getModelPack(exp);
        let Version = await model_pack.versions.findOne({version});

        let consentForm = await consentFormModel.findOne({exp, version});

        Logger({
            logs_target: exp,
            logs_extension: '.log',
            data: `getConsentForm IP=${IP} Ver=${version}`,
            sync: false
        });

        if (consentForm) {
            res.json({consentForm: Object.assign({}, consentForm['_doc'], {active: Version['_doc'].general.consent_form})});
        } else {
            return res.json({error: 'Form not found'});
        }
    }
    catch (e) {
        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getConsentForm IP=${IP} Ver=${version}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }
})

// @desc    Update Consent Form
// @route   PUT /api/consent_form/
// @access  Private
const updateConsentForm = asyncHandler(async (req, res) => {
    const {id, user_id, consent_form} = req.body;
    let consentForm = await consentFormModel.findById(id);

    if (consentForm) {
        await consentFormModel.updateOne(
            {_id: id},
            {
                $set:
                    {
                        consent_form,
                        last_modified: user_id,
                        date_modified: getTimeDate().date
                    }
            }
        );
        consentForm = await consentFormModel.findById(id);
        res.json({consentForm})
    } else {
        res.status(404);
        return res.json({error: 'Form not found'});
    }
})

module.exports = {
    addConsentForm,
    getConsentForm,
    updateConsentForm
}
