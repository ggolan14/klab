const asyncHandler = require('express-async-handler');
const {getModelPack, defaultVersions} = require('../models/models');
const {getTimeDate} = require('../utils');
const fs = require('fs');

const ExpDevFilesPath = 'uploads/ExpDev/';


const expDevDetailsModel = getModelPack('ExpDevDetails').ExpDevDetails;
// @desc    Create new Exp Dev Details
// @route   POST /api/exp_dev
// @access  Private
const addExpDev = asyncHandler(async (req, res) => {
    const {
        exp, user_id
    } = req.body

    let model_pack = getModelPack(exp);

    if (!model_pack){
        return res.json({error: 'Error occurs'});
    }

    let expDevDetails = await expDevDetailsModel.findOne({exp});

    if (expDevDetails){
        // res.status(400);
        return res.json({error: 'Exp exist'});
    }

    expDevDetails = new expDevDetailsModel({
        exp,
        description: '',
        version_of: '',
        status: 'SENT',
        files: [],
        last_modified: user_id,
        created_by: user_id,
        date_modified: getTimeDate().date,
        date_created: getTimeDate().date
    });

    await expDevDetails.save();

    let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;
    let ls = new ActiveSettingsModel({
        exp,
        version: 'test',
        mode: 'Real',
        running_name: 'test',
        last_modified: '-',
        date_modified: getTimeDate().date,
    });

    await ls.save();

    let new_set_obj = Object.assign({}, defaultVersions[exp]);
    new_set_obj.last_modified = user_id;
    new_set_obj.date_modified = getTimeDate().date;
    let new_version = new model_pack.versions(new_set_obj);
    await new_version.save();

    let consent_form = {
        body: '',
        radio_consent_text: '',
        radio_not_consent_text: '',
    };
    const consentFormModel = getModelPack('ConsentForms').ConsentForms;

    let consentForm = new consentFormModel({
        exp, version: 'test', consent_form, last_modified: '-', date_modified: getTimeDate().date
    });

    await consentForm.save();

    const RunningCountersModel = getModelPack('RunningCounters').RunningCounters;
    const runningCounters = new RunningCountersModel({
        exp, running_name: 'test', counter: 0
    });
    await runningCounters.save();


    if (!fs.existsSync('uploads/expDev/' + exp)){
        fs.mkdirSync('uploads/expDev/' + exp);
    }



    res.status(201).json({msg: 'Added Successfully'});
})

// @desc    Get Exp Dev Details
// @route   GET /api/exp_dev/
// @access  Private
const getExpDev = asyncHandler(async (req, res) => {

    try {
        const {exp} = req.params;

        let expDevDetails = await expDevDetailsModel.findOne({exp});

        let all_files = [];
        const new_path = ExpDevFilesPath + exp + '/';

        if (fs.existsSync(new_path)){
            fs.readdirSync(new_path).forEach(file => {
                all_files.push(file);
            });
        }

        if (expDevDetails) {
            res.json({expDev: Object.assign({}, expDevDetails['_doc'], {files: all_files})});
        } else {
            return res.json({error: 'Exp not found'});
        }
    }
    catch (e) {
        res.json({error: 'Some Error happened4'});
    }
})

// @desc    Update Exp Dev Details
// @route   PUT /api/exp_dev/
// @access  Private
const updateExpDev = asyncHandler(async (req, res) => {
    const {id, user_id, description, version_of, status} = req.body;
    let expDevDetails = await expDevDetailsModel.findById(id);

    if (expDevDetails) {
        await expDevDetailsModel.updateOne(
            {_id: id},
            {
                $set:
                    {
                        description, version_of, status,
                        last_modified: user_id,
                        date_modified: getTimeDate().date
                    }
            }
        );

        let updatedExpDev = await expDevDetailsModel.findById(id);

        let all_files = [];
        const new_path = ExpDevFilesPath + expDevDetails.exp + '/';

        fs.readdirSync(new_path).forEach(file => {
            all_files.push(file);
        });
        res.json({exp_details: Object.assign({}, updatedExpDev['_doc'], {files: all_files})});

        // res.json({exp_details: updatedExpDev});
    } else {
        return res.json({error: 'Exp not found'});
    }
})

module.exports = {
    addExpDev,
    getExpDev,
    updateExpDev
}
