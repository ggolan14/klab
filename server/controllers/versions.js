const asyncHandler = require('express-async-handler');
const {getModelPack, defaultVersions} = require('../models/models');
const {getTimeDate} = require('../utils');
const Logger = require("../logger");

const getExpMoreSettings = async ({exp, mode, model_pack, game_settings}) => {
    let more = {};
    try {
        if (exp.includes('WordPuzzle')){
            const {active_length, type_of, active_size, number_of_puzzles, active_models} = game_settings;

            let all_puzzles_models = await model_pack.extra.puzzles_models.find();

            // let p_active_models = [
            //     'S4',   'G4',
            //     'G_20', 'S_20',
            //     'G1',   'G2',
            //     'S1',   'S2'
            // ];

            let active_type_of = type_of;
            if (type_of === 'Both'){
                let rnd = Math.floor(Math.random() * 2);
                if (rnd === 0) active_type_of = 'Grouped';
                else active_type_of = 'Scattered';
            }

            if (mode === 'game'){
                let puzzles_models = [];

                // all_puzzles_models = all_puzzles_models['_doc'];
                for (let i=0; i<all_puzzles_models.length; i++){
                    all_puzzles_models[i] = all_puzzles_models[i]['_doc'];

                    let type_filter = active_models.indexOf(all_puzzles_models[i].puzzle_id) > -1;
                    let active_type_of_filter = all_puzzles_models[i].puzzle_type == active_type_of;
                    // let active_length_filter = all_puzzles_models[i].puzzle_length == active_length || active_length === 'All';
                    // let active_size_filter = all_puzzles_models[i].puzzle_size == active_size || active_size === 'All';

                    if (
                        type_filter && active_type_of_filter
                        //&& active_length_filter && active_size_filter
                    )
                        // puzzles_models.push(all_puzzles_models[i]);
                        puzzles_models.push({
                            [all_puzzles_models[i].puzzle_id]: {
                                puzzle_data: all_puzzles_models[i].puzzle_data,
                                puzzle_type: all_puzzles_models[i].puzzle_type,
                                puzzle_id: all_puzzles_models[i].puzzle_id,
                                puzzle_length: all_puzzles_models[i].puzzle_length,
                                puzzle_size: all_puzzles_models[i].puzzle_size,
                                puzzle_rows: all_puzzles_models[i].puzzle_rows,
                                puzzle_cols: all_puzzles_models[i].puzzle_cols,
                            }
                        })
                }

                if (puzzles_models.length > number_of_puzzles){
                    let difference = puzzles_models.length - Number(number_of_puzzles);
                    for (let k=0; k<difference; k++){
                        let pop_index = Math.floor(Math.random() * puzzles_models.length);
                        puzzles_models = puzzles_models.filter(
                            (p, p_index) => p_index !== pop_index
                        )
                    }
                }

                more.puzzles_models = puzzles_models;
            }
            else if (mode === 'admin'){
                let puzzles_models;
                if (!all_puzzles_models)
                    puzzles_models = [];
                else
                    puzzles_models = all_puzzles_models;
                more.puzzles_models = puzzles_models;
            }
        }
    }
    catch (e) {
        return {};
    }

    return more;
}

const fixGameVersion = (exp, Version) => {

    if (exp === 'ReversibleMatrices'){
        let version = {...Version};
        version.game.matrices_bank = version.game.matrices_bank.filter(
            mat => mat.active === 'True'
        );
        return version;
    }
    else if (exp === 'SignatureTimingEffect'){
        let version = {...Version};
        version.game.stories = version.game.stories.filter(
            mat => mat.active === 'True'
        );
        return version;
    }
    else if (exp === 'AbstractAndDeclarationEffect'){
        let version = {...Version};
        version.game.stories = version.game.stories.filter(
            mat => mat.active === 'True'
        );
        return version;
    }
    else if (exp === 'SignatureAsReminder'){
        let version = {...Version};
        const active_story = Number(version.game.a_s);

        if (version.game.stories.length === 0)
            version.game.stories = null;

        try {
            version.game.stories = version.game.stories[active_story];
        }
        catch (e) {
            version.game.stories = null;
        }
        if (!version.game.stories)
            version.game.stories = null;

        return version;
    }
    else if (exp === 'PointsGame'){
        let version = {...Version};
        try {
            let game_play = version.game.g_p;
            let final_game_play = [...game_play];
            let games_bank = version.game.g_b;
            let final_games_bank = [];

            if (game_play.length === 0)  throw 'err';
            let random_from = version.game.r;
            for (let i=0; i<game_play.length; i++){
                if (game_play[i] === 'null'){
                    if (random_from.length === 0) throw 'err';
                    let rnd_index = Math.floor(Math.random() * random_from.length);
                    const rnd_game = random_from[rnd_index];
                    final_game_play[i] = rnd_game;
                }
            }

            const games_indexes = Array.from(new Set(final_game_play));
            for (let i=0; i<games_indexes.length; i++){
                final_games_bank.push({
                    g_i: games_indexes[i],
                    g_s: games_bank[games_indexes[i]]
                })
            }
            if (!final_games_bank.length || !final_game_play.length)
                throw 'err';

            version.game.g_b = final_games_bank;
            version.game.g_p = final_game_play;
            delete version.game.r;
            version.error = false;
            // version.game.stories = version.game.stories[active_story];
        }
        catch (e) {
            version.error = true;
            // version.game.stories = null;
        }
        // if (!version.game.stories)
        //     version.game.stories = null;

        return version;
    }
    else if (exp === 'MegaDots'){
        let version = {...Version};
        try {
            let game_play = version.game.g_p;
            let final_game_play = [...game_play];
            let games_bank = version.game.g_b;
            let final_games_bank = [];

            if (game_play.length === 0)  throw 'err';
            let random_from = version.game.r;
            for (let i=0; i<game_play.length; i++){
                if (game_play[i] === 'null'){
                    if (random_from.length === 0) throw 'err';
                    let rnd_index = Math.floor(Math.random() * random_from.length);
                    const rnd_game = random_from[rnd_index];
                    final_game_play[i] = rnd_game;
                }
            }

            const games_indexes = Array.from(new Set(final_game_play));
            for (let i=0; i<games_indexes.length; i++){
                final_games_bank.push({
                    g_i: games_indexes[i],
                    g_s: games_bank[games_indexes[i]]
                })
            }
            if (!final_games_bank.length || !final_game_play.length)
                throw 'err';

            version.game.g_b = final_games_bank;
            version.game.g_p = final_game_play;
            delete version.game.r;
            version.error = false;
            // version.game.stories = version.game.stories[active_story];
        }
        catch (e) {
            version.error = true;
            // version.game.stories = null;
        }
        // if (!version.game.stories)
        //     version.game.stories = null;

        return version;
    }
    else if (exp === 'DotsMindGame'){
        let version = {...Version};
        try {
            let game_play = version.game.g_p;
            let final_game_play = [...game_play];
            let games_bank = version.game.g_b;
            let final_games_bank = [];

            if (game_play.length === 0)  throw 'err';
            let random_from = version.game.r;
            for (let i=0; i<game_play.length; i++){
                if (game_play[i] === 'null'){
                    if (random_from.length === 0) throw 'err';
                    let rnd_index = Math.floor(Math.random() * random_from.length);
                    const rnd_game = random_from[rnd_index];
                    final_game_play[i] = rnd_game;
                }
            }

            const games_indexes = Array.from(new Set(final_game_play));
            for (let i=0; i<games_indexes.length; i++){
                final_games_bank.push({
                    g_i: games_indexes[i],
                    g_s: games_bank[games_indexes[i]]
                })
            }
            if (!final_games_bank.length || !final_game_play.length)
                throw 'err';

            version.game.g_b = final_games_bank;
            version.game.g_p = final_game_play;
            delete version.game.r;
            version.error = false;
            // version.game.stories = version.game.stories[active_story];
        }
        catch (e) {
            version.error = true;
            // version.game.stories = null;
        }
        // if (!version.game.stories)
        //     version.game.stories = null;

        return version;
    }
    else if (exp === 'QueenGarden'){
        let version = {...Version};
        try {
            let games_bank = version.game.g_b;
            let final_games_bank = [];

            if (games_bank.length === 0)  throw 'err';
            for (let i=0; i<games_bank.length; i++){
                const {active, ...game_props} = games_bank[i];
                if (active === 'Yes'){
                    final_games_bank.push(game_props);
                }
            }
            if (!final_games_bank.length)
                throw 'err';

            version.game.g_b = final_games_bank;
            version.error = false;
        }
        catch (e) {
            version.error = true;
        }

        return version;
    }
    else if (exp === 'QueenGarden2'){
        let version = {...Version};
        try {
            let games_bank = version.game.g_b;
            let final_games_bank = [];

            if (games_bank.length === 0)  throw 'err';
            for (let i=0; i<games_bank.length; i++){
                const {active, ...game_props} = games_bank[i];
                if (active === 'Yes'){
                    final_games_bank.push(game_props);
                }
            }
            if (!final_games_bank.length)
                throw 'err';

            version.game.g_b = final_games_bank;
            version.error = false;
        }
        catch (e) {
            version.error = true;
        }

        return version;
    }
    else if (exp === 'QueenGarden3'){
        let version = {...Version};
        try {
            let games_bank = version.game.g_b;
            let final_games_bank = [];

            if (games_bank.length === 0)  throw 'err';
            for (let i=0; i<games_bank.length; i++){
                const {active, ...game_props} = games_bank[i];
                if (active === 'Yes'){
                    final_games_bank.push(game_props);
                }
            }
            if (!final_games_bank.length)
                throw 'err';

            version.game.g_b = final_games_bank;
            version.error = false;
        }
        catch (e) {
            version.error = true;
        }

        return version;
    }

    return Version;

}

const consentFormModel = getModelPack('ConsentForms').ConsentForms;

// when added, delete or rename version need to update: consent_form, active...

// @desc    Add New Version Of Experiment
// @route   POST /api/new_version
// @access  Private
const addNewVersion = asyncHandler(async (req, res) => {
    const {
        exp, action, version, user_id
    } = req.body

    let model_pack = getModelPack(exp);
    let new_version_name;

    if (action === 'NEW'){
        let found_index = false;
        let start_index = 0;
        while (!found_index){
            new_version_name = 'version_' + (start_index + 1);
            let exist_in_index = await model_pack.versions.findOne({version: new_version_name});
            if (exist_in_index)
                start_index++;
            else found_index = true;
        }

        let new_set_obj = Object.assign({}, defaultVersions[exp], {version: new_version_name});
        new_set_obj.last_modified = user_id;
        new_set_obj.date_modified = getTimeDate().date;
        let new_version = new model_pack.versions(new_set_obj);
        const new_ver = await new_version.save();

        let versions_list = await model_pack.versions.distinct('version');
        let consent_form = {
            body: '',
            radio_consent_text: '',
            radio_not_consent_text: '',
        };

        let consentForm = new consentFormModel({
            exp, version: new_version_name, consent_form, last_modified: '-', date_modified: getTimeDate().date
        });

        await consentForm.save();

        return res.json({msg: 'ADDED', versions_list, new_version: new_ver});
    }
    else if (action === 'DUPLICATE'){
        let found_index = false;
        let start_index = 1;
        while (!found_index){
            new_version_name = version + '_' + start_index;

            let exist_in_index = await model_pack.versions.findOne({version: new_version_name});
            if (exist_in_index)
                start_index++;
            else found_index = true;
        }

        let version_to_copy = await model_pack.versions.findOne({version});
        if (!version_to_copy){
            return res.json({error: 'Error'});
        }
        version_to_copy = version_to_copy['_doc'];
        delete version_to_copy['_id'];
        delete version_to_copy['__v'];
        delete version_to_copy['version'];

        version_to_copy.last_modified = user_id;
        version_to_copy.date_modified = getTimeDate().date;
        let new_set_obj = Object.assign({}, version_to_copy, {version: new_version_name});
        let new_settings = new model_pack.versions(new_set_obj);
        const new_version = await new_settings.save();

        let consent_form = {
            body: '',
            radio_consent_text: '',
            radio_not_consent_text: '',
        };

        let consentForm = new consentFormModel({
            exp, version: new_version_name, consent_form, last_modified: '-', date_modified: getTimeDate().date
        });

        await consentForm.save();

        let versions_list = await model_pack.versions.distinct('version');
        return res.json({msg: 'ADDED', versions_list, new_version});
    }

    return res.json({error: 'Error'});
})

// @desc    Update Version
// @route   PUT /api/version
// @access  Private
const updateVersion = asyncHandler(async (req, res) => {
    const {
        exp, version, user_id, version_before
    } = req.body

    if (version_before === 'test' && version.version !== 'test')
        return res.json({error: 'CANNOT_RENAME'});

    if (version_before === 'test' && version.version !== 'test')
        return res.json({error: 'CANNOT_RENAME'});

    let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;
    let activeSettings = await ActiveSettingsModel.findOne({exp});
    activeSettings = activeSettings['_doc'];

    if (version.version !== version_before){
        if (activeSettings.version === version_before){
            await ActiveSettingsModel.updateOne(
                {exp},
                {
                    $set:
                        {
                            version: version.version,
                            last_modified: user_id,
                            date_modified: getTimeDate().date
                        }
                }
            );
        }

        await consentFormModel.updateOne(
            {exp, version: version_before},
            {
                $set:
                    {
                        version: version.version
                    }
            }
        );
    }

    let new_version = {...version};

    let model_pack = getModelPack(exp);

    let exist_set = await model_pack.versions.findOne({version: version_before});
    if(!exist_set)
        return res.json({error: 'NOT_FOUND'});


    if (version.version !== version_before){
        let exist_new_set = await model_pack.versions.findOne({version: version.version});
        if(exist_new_set)
            return res.json({error: 'ALREADY_EXIST'});
    }

    await model_pack.versions.deleteMany({version: version_before});

    new_version.last_modified = user_id;
    new_version.date_modified = getTimeDate().date;

    let ls = new model_pack.versions(new_version);
    const newVersion = await ls.save();

    let versions_list = await model_pack.versions.distinct('version');

    activeSettings = await ActiveSettingsModel.findOne({
        exp
    });
    res.json({msg: 'SUCCESS', versions_list, version: newVersion, active_settings: activeSettings});
})

// @desc    Get SpecificVersion
// @route   GET /api/specific_version/
// @access  Private
const getSpecificVersion = asyncHandler(async (req, res) => {
    const {exp, version} = req.params;

    let model_pack = getModelPack(exp);
    let Version = await model_pack.versions.findOne({version})

    if (!Version){
        res.status(404);
        return res.json({error: 'Version not found'});
    }


    res.json({version: Version});

});

// @desc    Get Admin Version
// @route   GET /api/admin_version/
// @access  Private
const getAdminVersion = asyncHandler(async (req, res) => {
    const {exp} = req.params;
    let model_pack = getModelPack(exp);

    if (!model_pack){
        return res.json({error: 'Error occurs'});
    }

    let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;
    let active_settings = await ActiveSettingsModel.findOne({exp});

    try {
        active_settings = active_settings['_doc'];
    }
    catch (e) {
        return res.json({error: 'Error occurs'});
    }

    let Version = await model_pack.versions.find();
    if (!Version || Version.length === 0){
        let new_test_ver = new model_pack.versions(defaultVersions[exp]);
        await new_test_ver.save();
    }

    Version = await model_pack.versions.findOne({version: active_settings.version});
    try {
        Version = Version['_doc'];
    }
    catch (e) {
        return res.json({error: 'Error occurs'});
    }
    if (!Version){
        // res.status(404);
        return res.json({error: 'Version not found'});
    }

    const RunningCountersModel = getModelPack('RunningCounters').RunningCounters;
    let counters = await RunningCountersModel.find({exp});

    let more = {};
    let exp_more = await getExpMoreSettings({
        exp, mode: 'admin', model_pack, game_settings: Version.game
    });

    more = Object.assign({}, exp_more, more);
    more.versions_list = await model_pack.versions.distinct('version');

    res.json({version: Version, active_settings, more, counters});
});

// @desc    Get Game Version
// @route   GET /api/version/
// @access  Public
const getGameVersion = asyncHandler(async (req, res) => {
    const IP = req.headers['x-real-ip'] || '0.0.0.0';

    let {exp, user, chk, ng} = req.params;


    // if (exp === '') exp = ''

    try {
        Logger({
            logs_target: exp,
            data: `getGameVersion IP=${IP} UserId=${user}`,
            logs_extension: '.log',
            sync: false
        });

        let model_pack = getModelPack(exp);

        if (!model_pack) {
            return res.json({error: 'Loading Error'});
        }

        let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;
        let active_settings = await ActiveSettingsModel.findOne({exp});

        if (!active_settings) {
            return res.json({error: 'Loading Error'});
        }

        active_settings = active_settings['_doc'];

        let Version = await model_pack.versions.findOne({version: active_settings.version})

        if (!Version){
            return res.json({error: 'Loading Error'});
        }
        Version = Version['_doc'];

        if ((ng === false || ng === 'false') && (chk === false || chk === 'false') && active_settings.mode === 'Real'){

            let IP = req.headers['x-real-ip'] || '0.0.0.0';
            let date = getTimeDate();

            let ip_list_model = getModelPack('IPListRunning').IPListRunning;
            let ip_list = await ip_list_model.findOne({
                exp,
                user_id: user,
                date: date.date,
            });

            /*
                time: "42:04" = 42*60 + 4 = 2520 + 4 = 2524
                now_date: "1627900924166"

                time: "44:56" = 44*60 + 56 = 2640 + 56 = 2696
                now_date: "1627901096766"

                diff = 172600 mSec / 1000 = 172.6 -> 172 sec;
                time = 2696 - 2524 = 172 -> 2*60 + 52

                seconds in day 24*60*60 = 24*3600 = 86400 sec
             */

            if (!ip_list){
                ip_list = new ip_list_model({
                    exp,
                    user_id: user,
                    ip: IP,
                    date: date.date,
                    time: date.time,
                    now_date: Date.now()
                });

                await ip_list.save();
            }
            else {
                let last_enter = Number(ip_list.now_date);
                let now_date = Date.now();
                let diff = (now_date - last_enter) / 1000;
                diff = Math.floor(diff);
                if (diff < 86400){
                    let rej_users_model = getModelPack('RejectedUsers').RejectedUsers;

                    let date = getTimeDate();
                    let rej_user = new rej_users_model({
                        exp,
                        user_id: user,
                        ip: IP,
                        date: date.date,
                        time: date.time,
                        diff,
                    });

                    await rej_user.save();

                    return res.json({error: true});
                }
            }
        }

        const RunningCountersModel = getModelPack('RunningCounters').RunningCounters;

        let runningCounters = await RunningCountersModel.findOne({exp, running_name: active_settings.running_name});
        if (!runningCounters){
            let runningCounters_ = new RunningCountersModel({
                exp, running_name: 'test', counter: 0
            });
            await runningCounters_.save();

            if (active_settings.running_name !== 'test'){
                runningCounters_ = new RunningCountersModel({
                    exp, running_name: active_settings.running_name, counter: 0
                });
                await runningCounters_.save();
            }
            runningCounters = await RunningCountersModel.findOne({exp, running_name: active_settings.running_name});
        }

        let run_id = runningCounters['_doc'].counter + 1;
        if (runningCounters) {

            let uuu = await RunningCountersModel.updateOne(
                {exp, running_name: active_settings.running_name},
                {
                    $set:
                        {
                            counter: run_id
                        }
                }
            );
        }

        let more = await getExpMoreSettings({
            exp, mode: 'game', model_pack, game_settings: Version.game
        });


        delete Version.date_modified;
        delete Version.last_modified;
        delete Version.general.redirect_to;
        delete active_settings.date_modified;
        delete active_settings.last_modified;

        const fix_ver = fixGameVersion(exp, Version);

        res.json({version: fix_ver, run_id, active_settings, more});
    }
    catch (e) {
        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getGameVersion IP=${IP} UserId=${user}`,
            sync: false
        });

        res.status(404);
        return res.json({error: 'Not found'});
    }
});

// @desc    remove Version
// @route   DELETE /api/version_changes/
// @access  Private
const deleteVersion = asyncHandler(async (req, res) => {
    const {exp, version, user_id} = req.params;

    let model_pack = getModelPack(exp);
    let Version = await model_pack.versions.findOne({version});
    Version = Version['_doc'];

    if (Version) {
        if (Version.version === 'test'){
            res.status(404);
            return res.json({error: 'This version cannot be removed'});
        }

        let ActiveSettingsModel = getModelPack('ActiveSettings').ActiveSettings;

        let activeSettings = await ActiveSettingsModel.findOne({exp});
        activeSettings = activeSettings['_doc'];

        if (activeSettings.version === Version.version){
            await ActiveSettingsModel.updateOne(
                {exp},
                {
                    $set:
                        {
                            version: 'test',
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

        await consentFormModel.deleteMany({exp, version});

        await model_pack.versions.findByIdAndDelete(Version._id);

        let versions_list = await model_pack.versions.distinct('version');

        res.json({msg: 'SUCCESS', versions_list, active_settings: activeSettings});
    } else {
        res.status(404);
        return res.json({error: 'Version not found'});
    }
})

module.exports = {
    addNewVersion,
    updateVersion,
    deleteVersion,
    getSpecificVersion,
    getAdminVersion,
    getGameVersion
}


/*
    CHANGE MetaCognition to MetaSampling

   const dirs = {
    expDev: 'expDev',
    logs: 'logs'
};

let Model = getModelPack(exp).records;
let newModel = new Model({o:'o'});
await newModel.save();
await Model.deleteMany();

Model = getModelPack(exp).versions;
await Model.deleteMany();

newModel = new Model(defaultVersions[exp]);
await newModel.save();

if (!fs.existsSync(dirs.expDev + '/' + exp)){
    fs.mkdirSync(dirs.expDev + '/' + exp);
}
 */
