const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');
const { parse } = require('zipson');
const fs = require('fs');
const Logger = require('../logger');

const activeSettingsModel = getModelPack('ActiveSettings').ActiveSettings;
const ExpDevDetailsModel = getModelPack('ExpDevDetails').ExpDevDetails;
const consentFormModel = getModelPack('ConsentForms').ConsentForms;

// @desc    Create new Game Record
// @route   POST /api/record_game
// @access  Private
const addNewUserRecords = asyncHandler(async (req, res) => {
    console.log("---> in experiment_actions.js addNewUserRecords()")
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {Exp, UserId, Records, RunningName, cDate, ISA, Mode, Version} = req.body;

    try {
        Logger({
            logs_target: Exp,
            logs_extension: '.log',
            data: `addNewUserRecords IP=${IP} UserId=${UserId} Ver=${Version}`,
            sync: false
        });

        let model_pack = getModelPack(Exp);

        let us = new model_pack.records({
            UserId,
            RunningName,
            Permission: ISA? 'Admin' : "Patient",
            Records: parse(Records),
            Mode,
            Version,
            ClientStartTime: cDate,
            ServerStartTime: getTimeDate().time + ' | ' + getTimeDate().date,
            ClientEndTime: '-',
            ServerEndTime: '-',
            IP
        });

        let new_records = us.save();
        new_records.then(function (doc) {
            Logger({
                logs_target: Exp,
                logs_extension: '.log',
                data: `addNewUserRecords IP=${IP} UserId=${UserId} ExpId=${doc._id.toString()} Ver=${Version}`,
                sync: false
            });
            return res.json({msg: doc._id.toString(), status: "OK"});
            // use doc
        });
    }
    catch (e) {
        Logger({
            logs_target: Exp,
            logs_extension: '.err',
            data: `addNewUserRecords IP=${IP}} UserId=${UserId} Ver=${Version}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }

})

// @desc    Create new Game Record
// @route   POST /api/record_game
// @access  Private
const addNewRecord = asyncHandler(async (req, res) => {
    //console.log("---> in experiment_actions.js addNewRecord()")
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {Exp, ExpID, Records} = req.body;

    try {

        let model_pack = getModelPack(Exp);

        let records_stringify = parse(Records);

        // if (records_stringify)
        //     return res.json({msg: 'RecordSaved', status: "OK"});

        Logger({
            logs_target: Exp,
            logs_extension: '.log',
            data: `addNewRecord IP=${IP} ExpID=${ExpID} Length=${records_stringify.length}`,
            sync: false
        });

        if (typeof records_stringify === 'object' &&
            !Array.isArray(records_stringify) &&
            records_stringify !== null ){
            for (let key in records_stringify){
                // game_rec[key] = records_stringify[key];
                await model_pack.records.updateOne(
                    { _id : ExpID },
                    // { $push: { 'Records.Game': records_stringify } },
                    { $set: { [`Records.Game.${key}`]: records_stringify[key] } }
                )
            }
            res.json({msg: 'RecordSaved', status: "OK"});
        }
        else {
            model_pack.records.updateOne(
                { _id : ExpID },
                // { $push: { 'Records.Game': records_stringify } },
                { $push: { 'Records.Game': { $each: records_stringify  } } },
                // { $push: { 'Records.Game': records_stringify } },
                function (err, result) {
                    if (err) throw err;
                    res.json({msg: 'RecordSaved', status: "OK"});
                })
        }
    }
    catch (e) {
        Logger({
            logs_target: Exp,
            logs_extension: '.err',
            data: `addNewRecord IP=${IP} ExpID=${ExpID}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }
})

// @desc    Create new Game Record
// @route   POST /api/record_game
// @access  Private
const finishRecord = asyncHandler(async (req, res) => {
    console.log("---> in experiment_actions.js finishRecord()")
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {Exp, ExpID, Records, Date} = req.body;

    try {
        // Summary
        // Payment
        let model_pack = getModelPack(Exp);

        let records_stringify = parse(Records);

        // let exp_rec = await model_pack.records.findById(ExpID);
        // let records = exp_rec['_doc'].Records;
        //
        // records.Summary = records_stringify.Summary;
        // records.Payment = records_stringify.Payment;


        Logger({
            logs_target: Exp,
            logs_extension: '.log',
            data: `finishRecord IP=${IP} ExpID=${ExpID}`,
            sync: false
        });

        model_pack.records.updateOne(
            { _id : ExpID },
            { $set: {
                    'Records.Summary': records_stringify.Summary,
                    'Records.Payment': records_stringify.Payment,
                    'Records.MoreRec': records_stringify.MoreRec,
                    ClientEndTime: Date,
                    ServerEndTime: getTimeDate().time + ' | ' + getTimeDate().date
                } },
            function (err, result) {
                if (err) throw err;
                res.json({msg: 'RecordSaved', status: "OK"});
            })
    }
    catch (e) {
        Logger({
            logs_target: Exp,
            logs_extension: '.err',
            data: `finishRecord IP=${IP} ExpID=${ExpID}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }


    // await model_pack.records.updateOne(
    //     {_id: ExpID},
    //     {
    //         $set:
    //             {
    //                 Records: records,
    //                 ClientEndTime: Date,
    //                 ServerEndTime: getTimeDate().time + ' | ' + getTimeDate().date,
    //             }
    //     }
    // );

})

// @desc    Get Redirect url
// @route   GET /api/rdc/
// @access  Public
const getRedirectTo = asyncHandler(async (req, res) => {
    console.log("---> in experiment_actions.js getRedirectTo()")
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {ex, ve, ex_id, user_id} = req.params;

    try {
        let model_pack = getModelPack(ex);
        if (!model_pack){
            return res.json({error: 'NOT_SETTINGS'});
        }

        Logger({
            logs_target: ex,
            logs_extension: '.log',
            data: `getRedirectTo IP=${IP} UserId=${user_id} ExpID=${ex_id} Ver=${ve}`,
            sync: false
        });

        let version = await model_pack.versions.findOne({version: ve});

        version = version['_doc'];

        if (version) {
            version.general.redirect_to += "&userID="+user_id;
            console.log("Final redirect link:" + version.general.redirect_to)
            res.json({rdc: version.general.redirect_to});
        } else {
            res.status(404);
            return res.json({error: 'Not found'});
        }
    }
    catch (e) {
        Logger({
            logs_target: ex,
            logs_extension: '.err',
            data: `getRedirectTo IP=${IP} UserId=${user_id} ExpID=${ex_id} Ver=${ve}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }
});


// @desc    Get Is Exp Ready
// @route   GET /api/st_ex/
// @access  Public
const getIsExpReady = asyncHandler(async (req, res) => {
    console.log("---> in experiment_actions.js getIsExpReady()")
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {exp} = req.params;
    try {

        let exp_dev_details_exist = await ExpDevDetailsModel.findOne({exp});

        Logger({
            logs_target: exp,
            logs_extension: '.log',
            data: `getIsExpReady IP=${IP} status=${exp_dev_details_exist.status === 'READY' ? 'Y' : 'N'}`,
            sync: false
        });

        if (exp_dev_details_exist) {
            res.json({msg: exp_dev_details_exist.status === 'READY' ? 'Y' : 'N'});
        } else {
            return res.json({error: 'Not found'});
        }
    }
    catch (e){
        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getIsExpReady IP=${IP}}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }
});

// @desc    Get Consent Form
// @route   GET /api/consent_form/
// @access  Private
const getGameConsentForm = asyncHandler(async (req, res) => {
    console.log("---> in experiment_actions.js getGameConsentForm()")
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    const {exp} = req.params;
    try {

        Logger({
            logs_target: exp,
            logs_extension: '.log',
            data: `getGameConsentForm IP=${IP}`,
            sync: false
        });

        let model_pack = getModelPack(exp);

        if (!model_pack) {
            return res.json({error: 'Loading Error'});
        }
        let activeSettings = await activeSettingsModel.findOne({exp});
        activeSettings = activeSettings['_doc'];

        if (!activeSettings) {
            return res.json({error: 'Loading Error'});
        }

        let Version = await model_pack.versions.findOne({version: activeSettings.version});

        if (!Version) {
            return res.json({error: 'Loading Error'});
        }

        Version = Version['_doc'];

        let need_consent = Version.general.consent_form === 'Yes';

        if (!need_consent)
            return res.json({cf: 'N'})

        let consentForm = await consentFormModel.findOne({exp, version: activeSettings.version});

        consentForm = consentForm['_doc'];

        if (consentForm) {
            res.json({cf: 'Y', cf_b: consentForm.consent_form});
        } else {
            return res.json({error: 'Form not found'});
        }
    }
    catch (e) {
        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getGameConsentForm IP=${IP}}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }
})

module.exports = {
    getRedirectTo,
    getIsExpReady,
    addNewRecord,
    getGameConsentForm,
    addNewUserRecords,
    finishRecord
}
