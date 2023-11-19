const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');

const VersionChangesModel = getModelPack('VersionChanges').VersionChanges;

// @desc    Create new VersionChanges
// @route   POST /api/version_changes
// @access  Private
const addVersionChanges = asyncHandler(async (req, res) => {
    const {
        exp, header, description
    } = req.body

    let versionChanges = await VersionChangesModel.findOne({exp});

    if (!versionChanges){
        res.status(400);
        return res.json({error: 'Changes not exist'});
    }
    else {
        versionChanges.changes = versionChanges.changes.concat({
            header, description
        });

        const updatedChanges = await versionChanges.save()

        res.json(updatedChanges)
    }
})

// @desc    Get VersionChanges
// @route   GET /api/version_changes/
// @access  Private
const getVersionChanges = asyncHandler(async (req, res) => {

    const {exp} = req.query;

    let versionChanges = await VersionChangesModel.findOne({exp});

    if (versionChanges) {
        res.json(versionChanges);
    } else {
        res.status(404);
        return res.json({error: 'Changes not found'});
    }
})

// @desc    Update VersionChanges
// @route   PUT /api/version_changes/
// @access  Private
const updateVersionChanges = asyncHandler(async (req, res) => {
    const {id, header, description} = req.query;

    let versionChanges = await VersionChangesModel.findById(id);

    if (versionChanges) {
        versionChanges.header = header;
        versionChanges.description = description;

        const updateChanges = await versionChanges.save();

        res.json(updateChanges)
    } else {
        res.status(404);
        return res.json({error: 'Changes not found'});
    }
})

// @desc    remove VersionChanges
// @route   DELETE /api/version_changes/
// @access  Private
const deleteVersionChanges = asyncHandler(async (req, res) => {
    const {id} = req.query;

    let versionChanges = await VersionChangesModel.findById(id);

    if (versionChanges) {
        await versionChanges.findByIdAndDelete(id);
        res.json({msg: 'Delete success'});
    } else {
        res.status(404);
        return res.json({error: 'Changes not found'});
    }
})

module.exports = {
    addVersionChanges,
    getVersionChanges,
    updateVersionChanges,
    deleteVersionChanges
}
