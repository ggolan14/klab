const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');

const activeSettingsModel = getModelPack('ActiveSettings').ActiveSettings;

// @desc    Create new Active Settings
// @route   POST /api/active_settings
// @access  Private
const addActiveSettings = asyncHandler(async (req, res) => {
    const {
        exp, version
    } = req.body;
    let activeSettings = await activeSettingsModel.findOne({exp});

    if (activeSettings){
        res.status(400);
        return res.json({error: 'Active settings exist'});
    }
    else {
        activeSettings = new activeSettingsModel({
            exp,
            version,
            mode: 'Real',
            running_name: 'test',
            last_modified: '-',
            date_modified: getTimeDate().date
        });

        const active_settings = await activeSettings.save();
        res.status(201).json({active_settings});
    }
})

// @desc    Get Active Settings
// @route   GET /api/active_settings/
// @access  Private
const getActiveSettings = asyncHandler(async (req, res) => {

    const {exp} = req.params;

    let activeSettings = await activeSettingsModel.findOne({exp});

    if (activeSettings) {
        res.json(activeSettings);
    } else {
        res.status(404);
        return res.json({error: 'Settings not found'});
    }
})

// @desc    Update Active Settings
// @route   PUT /api/active_settings/
// @access  Private
const updateActiveSettings = asyncHandler(async (req, res) => {

    const {user_id, active_settings} = req.body;
    const {exp, version, mode, running_name} = active_settings;

    let activeSettings = await activeSettingsModel.findOne({
        exp
    });

    if (activeSettings) {
        await activeSettingsModel.updateOne(
            {exp},
            {
                $set:
                    {
                        version, mode, running_name,
                        last_modified: user_id,
                        date_modified: getTimeDate().date
                    }
            }
        );

        // const updatedSettings = await activeSettings.save();
        activeSettings = await activeSettingsModel.findOne({
            exp
        });

        res.json({active_settings: activeSettings});
    } else {
        // res.status(404);
        return res.json({error: 'Settings not found'});
    }
})

module.exports = {
    addActiveSettings,
    getActiveSettings,
    updateActiveSettings
}
