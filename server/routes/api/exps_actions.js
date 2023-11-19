const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const {addConsentForm, getConsentForm, updateConsentForm} = require('../../controllers/consent_form');
const {addChat, getChat} = require('../../controllers/chat');
const {downloadTodoFile, uploadTodoFiles, addTodoList, updateTodoQueue, getTodoList, updateTodoList, deleteTodoList, deleteTodoFile, addFilesOfTodoList} = require('../../controllers/todo');
const {addVersionChanges, getVersionChanges, updateVersionChanges, deleteVersionChanges} = require('../../controllers/version_changes');
const {addRunningCounters, increaseRunningCounters, getRunningCounter, getExpRunningCounters, resetRunningCounters, deleteRunningCounters} = require('../../controllers/runnings');
const {addActiveSettings, getActiveSettings, updateActiveSettings} = require('../../controllers/active_settings');
const {addExpDev, getExpDev, updateExpDev} = require('../../controllers/exp_dev');
const {getExpsUsersList, getExpsList, getExpVerList} = require('../../controllers/exps_users_list');
const {getRedirectTo, getIsExpReady, getGameConsentForm, addNewRecord, addNewUserRecords, finishRecord} = require('../../controllers/experiment_actions');
const {addNewVersion, updateVersion, deleteVersion, getSpecificVersion, getAdminVersion, getGameVersion} = require('../../controllers/versions');
const {uploadFiles, downloadFile, deleteFile} = require('../../controllers/files');

const { getFilters, getData, downloadData, wpImages} = require('../../controllers/reports');

const {addNewExperiment} = require('../../models/models');

// addNewExperiment('SignatureTimingEffect').then(res => console.log('addNewExperiment', res));

router.post('/new_exp', auth, addNewExperiment);

router.get('/consent_form/:exp&:version', getConsentForm);
router.post('/consent_form', auth, addConsentForm);
router.put('/consent_form', auth, updateConsentForm);

router.get('/chat/:exp', auth, getChat);
router.post('/chat', auth, addChat);


router.get('/todo', auth, getTodoList);
router.post('/todo', auth, addTodoList);
router.post('/todo/queue', auth, updateTodoQueue);
router.post('/todo/file/:exp&:todo_id&:is_new', auth, addFilesOfTodoList);
////
router.get('/todo/file/', auth, downloadTodoFile);
// router.post('/todo/file/', auth, uploadTodoFiles);

router.put('/todo', auth, updateTodoList);
router.delete('/todo/:id', auth, deleteTodoList);
router.delete('/todo/file/:exp&:file_name&:todo_id', auth, deleteTodoFile);

router.get('/version_changes', auth, getVersionChanges);
router.post('/version_changes', auth, addVersionChanges);
router.put('/version_changes', auth, updateVersionChanges);
router.delete('/version_changes', auth, deleteVersionChanges);

router.get('/exp_running', auth, getExpRunningCounters);
router.get('/running', auth, getRunningCounter);
router.post('/running', auth, addRunningCounters);
router.put('/running', auth, resetRunningCounters);
// router.put('/i_running', increaseRunningCounters);
router.delete('/running/:exp&:running_name&:user_id', auth, deleteRunningCounters);

router.get('/active_settings/:exp', auth, getActiveSettings);
router.post('/active_settings', auth, addActiveSettings);
router.put('/active_settings', auth, updateActiveSettings);

router.get('/exp_dev/:exp', auth, getExpDev);
router.post('/exp_dev', auth, addExpDev);
router.put('/exp_dev', auth, updateExpDev);

router.get('/exps_users_list', auth, getExpsUsersList);
router.get('/exps_list', auth, getExpsList);
router.get('/exp_ver_list/:exp', auth, getExpVerList);

router.get('/rdc/:ex&:ve&:ex_id&:user_id', getRedirectTo);
router.get('/st_ex/:exp', getIsExpReady);
router.post('/record_game', addNewRecord);
router.post('/new_game', addNewUserRecords);
router.post('/finish_game', finishRecord);
router.get('/cf/:exp', getGameConsentForm);
router.get('/ver/:exp&:user&:chk&:ng', getGameVersion);


router.post('/get_filters/', auth, getFilters);
// router.post('/download_data', auth, downloadData);
router.get('/download_data/', auth, downloadData);
// router.get('/download_data/:exp&:filters&:tables', auth, downloadData);
router.get('/wp_images', auth, wpImages);
// router.post('/get_filters', auth, getFilters);
// router.get('/exp_runs/:exp', auth, getExpRuns);
// router.post('/run_vers/', auth, getRunVers);
// router.post('/run_ver_users/', auth, getRunVerUsers);
// router.delete('/delete_data', auth, deleteData);

router.post('/new_version', auth, addNewVersion);
router.put('/version', auth, updateVersion);
router.delete('/version/:exp&:version&:user_id', auth, deleteVersion);
router.get('/specific_version/:exp&:version', auth, getSpecificVersion);
router.get('/admin_version/:exp', auth, getAdminVersion);

router.post('/file/:exp&:from&:action', auth, uploadFiles);
router.get('/file/', auth, downloadFile);
// router.get('/file/:exp&:file_name', auth, downloadFile);
router.delete('/file/:exp&:file_name&:user_id', auth, deleteFile);

module.exports = router;


// const getRunningCounters = async ({exp, running_name}) => {
//     let RunningCountersModel = getModelPack('RunningCounters').RunningCounters;
//     let filters = {exp};
//     if (running_name)
//         filters.running_name = running_name;
//
//     let running_counters;
//     if (Object.keys(filters).length > 1)
//         running_counters = await RunningCountersModel.findOne(filters);
//     else
//         running_counters = await RunningCountersModel.find(filters);
//
//     if (!running_counters || running_counters.length < 1) {
//         running_counters = new RunningCountersModel({
//             exp,
//             running_name: running_name || 'test',
//             counter: 0
//         });
//
//         await running_counters.save();
//     }
//
//     return Array.isArray(running_counters) ? running_counters : [running_counters];
// };

/*
RECORDS:

global: {
    UserId: '',
    RunningName: '',
    Records: {game, payment, summary, KeyTable},
    Date: ''
}


cm - { UserId: string, Records: {game, payment, summary, CURRENT_DATE}, Date: string}
ct2 - { user_id: string, task: string, data: array, date: string, exp_id}
ct3 - { RunningName, UserId: string, Records: {game, payment, summary, SupportTools, ComprehensionChecks, KeyTable, CURRENT_DATE}, Date: string}
ct - { user_id: string, data: array, date: string}
dfe - { RunningName, UserId: string, Records: {game, payment, summary, KeyTable, CURRENT_DATE}, Date: string}
mc - { RunningName, UserId: string, Records: {game, payment, summary, KeyTable, CURRENT_DATE}, Date: string}
wp - { UserId, exp_id, user_detalis, objects, puzzles, ques, payment, date, time }
only_wp - { UserId, exp_id, user_detalis,, puzzles, payment, date, time }
only_wp_yuval - { UserId, exp_id, user_detalis,, puzzles, payment, date, time }
pg - data
pg_sh - { UserId, RunningName, Date, Records: {game, payment, summary, CURRENT_DATE}, }
pl_pat - { UserId, RunningName, Date, Records: {game, payment, summary, KeyTable, CURRENT_DATE}, }
rc - { UserId, RunningName, Date, Records: {game, payment, summary, KeyTable, ComprehensionChecks, SupportTools, CURRENT_DATE}, }
sp - { UserId, Date, Records: {game, payment, summary, CURRENT_DATE}, }
try_or_give - data


 */
