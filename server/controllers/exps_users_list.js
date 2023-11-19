const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');

const expDevDetailsModel = getModelPack('ExpDevDetails').ExpDevDetails;
const UserModel = getModelPack('User').User;

// @desc    Get Exp Dev Details
// @route   GET /api/exps_list/
// @access  Private
const getExpsUsersList = asyncHandler(async (req, res) => {

    let exps_list = await expDevDetailsModel.distinct('exp');
    let users_list = await UserModel.find().select('_id email Experiments');
    res.json({exps_list, users_list});
});

// @desc    Get ExpsList
// @route   GET /api/exps_list/
// @access  Private
const getExpsList = asyncHandler(async (req, res) => {
    let exps_list = await expDevDetailsModel.distinct('exp');
    res.json({exps_list});
});

// @desc    Get ExpsList
// @route   GET /api/exps_list/
// @access  Private
const getExpVerList = asyncHandler(async (req, res) => {
    try {
        const {exp} = req.params;
        let model_pack = getModelPack(exp);
        let exp_ver_list = await model_pack.versions.distinct('version');
        res.json({exp_ver_list});
    }
    catch (e) {
        res.json({exp_ver_list: []});
    }
});

module.exports = {
    getExpsUsersList,
    getExpsList,
    getExpVerList
}
