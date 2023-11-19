const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');

const RunningCountersModel = getModelPack('RunningCounters').RunningCounters;

// @desc    Create new RunningCounters
// @route   POST /api/version_changes
// @access  Private
const addRunningCounters = asyncHandler(async (req, res) => {
    const {
        exp, running_name
    } = req.body

    let runningCounters = await RunningCountersModel.findOne({
        exp, running_name
    });

    if (runningCounters){
        // res.status(400);
        return res.json({error: 'Running exist'});
    }
    else {
        runningCounters = new RunningCountersModel({
            exp, running_name, counter: 0
        });

        await runningCounters.save();
        const rc = await RunningCountersModel.find({exp});
        res.status(201).json({counters: rc});
    }
})

// @desc    Get RunningCounters
// @route   GET /api/version_changes/
// @access  Private
const getExpRunningCounters = asyncHandler(async (req, res) => {

    const {exp} = req.query;

    let runningCounters = await RunningCountersModel.findOne({exp});

    if (runningCounters) {
        res.json(runningCounters);
    } else {
        res.status(404)
        return res.json({error: 'Running not found'});
    }
});

// @desc    Get RunningCounters
// @route   GET /api/version_changes/
// @access  Private
const getRunningCounter = asyncHandler(async (req, res) => {

    const {exp, running_name} = req.query;

    let runningCounters = await RunningCountersModel.findOne({exp, running_name});

    if (runningCounters) {
        res.json(runningCounters);
    } else {
        res.status(404);
        return res.json({error: 'Running not found'});
    }
});

// @desc    Update RunningCounters
// @route   PUT /api/version_changes/
// @access  Private
const resetRunningCounters = asyncHandler(async (req, res) => {
    const {exp, running_name, user_id} = req.body;

    let runningCounters = await RunningCountersModel.findOne({exp, running_name});

    if (runningCounters) {

        await RunningCountersModel.updateOne(
            {exp, running_name},
            {
                $set:
                    {
                        counter: 0
                    }
            }
        );

        let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;

        let activeSettings = await ActiveSettingsModel.findOne({exp});

        let counters = await RunningCountersModel.find({exp});
        res.json({msg: 'RESET_SUCCESS', counters, active_settings: activeSettings});


    } else {
        // res.status(404);
        return res.json({error: 'Running not found'});
    }
})

// @desc    Update RunningCounters
// @route   PUT /api/version_changes/
// @access  Public
const increaseRunningCounters = asyncHandler(async (req, res) => {
    const {exp, running_name, user_id} = req.query;

    let runningCounters = await RunningCountersModel.findOne({exp, running_name});

    if (runningCounters) {
        await runningCounters.updateOne(
            {exp},
            {
                $set:
                    {
                        counter: runningCounters['_doc'].counter + 1
                    }
            }
        );

        runningCounters = await RunningCountersModel.findOne({exp, running_name});

        res.json({msg: 'SUCCESS', c: runningCounters.counter});
    } else {
        // res.status(404);
        return res.json({error: 'Running not found'});
    }
})

// @desc    remove Running
// @route   DELETE /api/version_changes/
// @access  Private
const deleteRunningCounters = asyncHandler(async (req, res) => {
    const {exp, running_name, user_id} = req.params;

    let runningCounters = await RunningCountersModel.findOne({exp, running_name});
    runningCounters = runningCounters['_doc'];

    if (runningCounters) {
        if (runningCounters.running_name === 'test'){
            res.status(404);
            return res.json({error: 'This running cannot be removed'});
        }

        let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;

        let activeSettings = await ActiveSettingsModel.findOne({exp});
        activeSettings = activeSettings['_doc'];

        if (activeSettings.running_name === runningCounters.running_name){
            await ActiveSettingsModel.updateOne(
                {exp},
                {
                    $set:
                        {
                            running_name: 'test',
                            last_modified: user_id,
                            date_modified: getTimeDate().date
                        }
                }
            );

            // const updatedSettings = await activeSettings.save();
            activeSettings = await ActiveSettingsModel.findOne({
                exp
            });
        }

        await RunningCountersModel.findByIdAndDelete(runningCounters._id);

        let counters = await RunningCountersModel.find({exp});

        res.json({msg: 'DEL_SUCCESS', counters, active_settings: activeSettings});
    } else {
        res.status(404);
        return res.json({error: 'Running not found'});
    }
})

module.exports = {
    addRunningCounters,
    getExpRunningCounters,
    getRunningCounter,
    resetRunningCounters,
    deleteRunningCounters,
    increaseRunningCounters
}
