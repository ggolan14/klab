const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');
const {stringify} = require('zipson');
const fs = require("fs");
// const ObjectsToCsv = require('objects-to-csv');
const ObjectsToCsv = require('../utils/objects_to_csv');
const JSZip = require("jszip");
const Logger = require("../logger");
const ExcelJS = require('exceljs');

// var svg = require('svg-builder');
// const { createCanvas, loadImage } = require('canvas')

const addLineToGame = (records, isArray, game_table) => {
    console.log("---> addLineToGame")
    let game = [];
    let add_to_game_line = {
        ExpID: records._id.toString(),
        ID: records.Records.KeyTable.ID,
        Age: records.Records.UserDetails.Age,
        Gender: records.Records.UserDetails.Gender,
        RunningName: records.RunningName,
        Version: records.Records.KeyTable.Version
    };

    if (isArray)
        for (let j = 0; j < records.Records.Game.length; j++) {
            game.push(Object.assign({}, add_to_game_line, records.Records.Game[j]));
        }
    else {
        for (let j = 0; j < records.Records.Game[game_table].length; j++) {
            game.push(Object.assign({}, add_to_game_line, records.Records.Game[game_table][j]));
        }
    }
    return game;
}

const filtersCreate = (filters) => {
    console.log("---> filtersCreate")
    let new_filters = {};
    new_filters['$and'] = [];
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].value !== null && filters[i].value !== 'All' && filters[i].value !== '')
            new_filters['$and'].push({
                [filters[i].filter]: filters[i].value
            });
    }

    return new_filters['$and'].length > 0 ? new_filters : {};
};

const ExpsTables = ['Game', 'UserDetails', 'KeyTable', 'Summary', 'Payment'];

const ExpMoreRec = exp => {
    console.log("---> ExpMoreRec")
    return {SP: 'NFC', RepeatedChoice: ['SupportTools', 'ComprehensionChecks']}[exp];
};

const ExpGameDataSize = exp => {
    console.log("---> ExpGameDataSize")
    const object_exp = ['RepeatedChoice'];
    if (object_exp.indexOf(exp) > -1)
        return {
            "$objectToArray": "$Records.Game"
        };
    return "$Records.Game";
};

const ExpGameGroup = exp => {
    console.log("---> ExpGameGroup")
    switch (exp) {
        case 'RepeatedChoice':
            return {
                PL: {$push: '$Records.Game.PL'},
                RT: {$push: '$Records.Game.RT'},
                RD: {$push: '$Records.Game.RD'},
                DFE_Pattern: {$push: '$Records.Game.DFE_Pattern'},
                PL_Pattern: {$push: '$Records.Game.PL_Pattern'},
            };
        default:
            return {
                Game: {$push: '$Records.Game'}
            }
    }
};

const ExpGameProject = exp => {
    console.log("---> ExpGameProject")
    switch (exp) {
        case 'RepeatedChoice':
            return {
                PL: '$Records.Game.PL',
                RT: '$Records.Game.RT',
                RD: '$Records.Game.RD',
                DFE_Pattern: '$Records.Game.DFE_Pattern',
                PL_Pattern: '$Records.Game.PL_Pattern',
            };
        default:
            return {
                Game: '$Records.Game'
            }
    }
};

const ExpGameAddFields = exp => {
    console.log("---> ExpGameAddFields")
    switch (exp) {
        case 'RepeatedChoice':
            return {
                PL: {
                    "$reduce": {
                        "input": "$PL",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", "$$this"]}
                    }
                },
                RT: {
                    "$reduce": {
                        "input": "$RT",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", "$$this"]}
                    }
                },
                RD: {
                    "$reduce": {
                        "input": "$RD",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", "$$this"]}
                    }
                },
                DFE_Pattern: {
                    "$reduce": {
                        "input": "$DFE_Pattern",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", "$$this"]}
                    }
                },
                PL_Pattern: {
                    "$reduce": {
                        "input": "$PL_Pattern",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", "$$this"]}
                    }
                },
            };
        default:
            return {
                Game: {
                    "$reduce": {
                        "input": "$Game",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", "$$this"]}
                    }
                },
            }
    }
};

// const ExpsTables = {
//     WordPuzzle: ['Game', 'UserDetails', 'KeyTable', 'Summary', 'Payment'],
//     MetaSampling: ['Game', 'UserDetails', 'KeyTable', 'Summary', 'Payment'],
//     ReversibleMatrices: ['Game', 'UserDetails', 'KeyTable', 'Summary', 'Payment'],
//     SignatureTimingEffect: ['Game', 'UserDetails', 'KeyTable', 'Summary', 'Payment'],
//     CupsGame: ['Game', 'UserDetails', 'KeyTable', 'Summary', 'Payment'],
// }

// @desc    Get Filters
// @route   GET /api/get_filters/
// @access  Private
const getFilters2 = asyncHandler(async (req, res) => {
    console.log("---> getFilters2")

    let {exp, filters} = req.body;

    // filters = JSON.parse(filters);

    let model_pack = getModelPack(exp);

    let permissions, running_names, users, tables, modes, versions;

    let filters_create = [];
    for (let f in filters) {
        if (filters[f] !== null && filters[f] !== '' && filters[f] !== 'All')
            filters_create.push({
                filter: f,
                value: filters[f],
            })
    }

    modes = await model_pack.records.distinct("Mode");

    const filters_ordered = filtersCreate(filters_create);


    versions = await model_pack.records.find(filters_ordered).distinct("Version");
    permissions = await model_pack.records.find(filters_ordered).distinct("Permission");
    running_names = await model_pack.records.find(filters_ordered).distinct("RunningName");
    users = await model_pack.records.find(filters_ordered).distinct("UserId");
    let records = await model_pack.records.find(filters_ordered);
    let records_keys = [];
    for (let i = 0; i < records.length; i++) {
        for (let key in records[i]['_doc'].Records) {
            if (key === 'Game' && !Array.isArray(records[i]['_doc'].Records[key])) {
                for (let game_key in records[i]['_doc'].Records[key]) {
                    records_keys.push(game_key);
                }
            } else
                records_keys.push(key);

        }
    }

    tables = Array.from((new Set(records_keys)));
    res.json({
        permissions,
        running_names,
        users,
        tables,
        modes,
        versions
    });
});

const getFilters = asyncHandler(async (req, res) => {
    console.log("---> getFilters")

    let {exp, filters} = req.body;
    console.log("---> getFilters 111")

    try {
        console.log("---> getFilters 222")
        let model_pack = getModelPack(exp);

        if (!model_pack) {
            console.log("---> getFilters 333 Error")
            return res.status(400).json({error: 'Error'});
        }
        console.log("---> getFilters 100")
        let filters_create = [];

        if (filters.runnings && filters.runnings.length > 0) {
            console.log("---> getFilters 101")
            filters_create.push({
                RunningName: {$in: filters.runnings}
            });
        }
        if (filters.versions && filters.versions.length > 0) {
            console.log("---> getFilters 102")
            filters_create.push({
                Version: {$in: filters.versions}
            });
        }
        if (filters.permissions && filters.permissions.length > 0) {
            console.log("---> getFilters 103")
            filters_create.push({
                Permission: {$in: filters.permissions}
            });
        }
        // if (filters.users.length > 0){
        //     filters_create.push({
        //         UserId: {$in: filters.users}
        //     });
        // }
        console.log("---> getFilters 104")
        let match_filters = {
            $and: [
                {
                    "Records.Game": {"$exists": true}
                },
                {
                    $expr: {
                        $gt: [{
                            $size: ExpGameDataSize(exp)
                        }, 0
                        ]
                    }
                },
                // {
                //     $expr: {
                //         $gt: [{
                //             $size: {
                //                 "$objectToArray": "$Records.Game"
                //             }}, 0
                //         ]
                //     }
                // },
                // {
                //     $expr: {
                //         $gt: [{ $size: "$Records.Game" }, 0]
                //     }
                // }
                // {'Records.Game': { $size: {$gt: 0} }}
            ]
        };
        if (filters_create.length > 0) {
            console.log("---> getFilters 105")
            for (let i = 0; i < filters_create.length; i++) {
                match_filters.$and.push(filters_create[i]);
            }
        }

        let results = await model_pack.records.aggregate([
            {"$match": match_filters},
            {
                $group: {
                    _id: null,
                    runnings: {$addToSet: '$RunningName'},
                    users: {$addToSet: '$UserId'},
                    versions: {$addToSet: '$Version'},
                    permissions: {$addToSet: '$Permission'},
                }
            }
        ]);
        console.log("---> getFilters 106 results.size=" + results.size)
        if (results && results[0])
            delete results[0]._id;

        res.json({filters: (results && results[0]) ? results[0] : null});
    } catch (e) {
        console.log('e', e)
        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getFilters user=${req.user.id}`,
            sync: false
        });
        return res.status(400).json({error: 'Error'});
    }
});

// @desc    Get Filters
// @route   GET /api/get_filters/
// @access  Private
const getExpRuns = asyncHandler(async (req, res) => {
    console.log("---> getExpRuns")

    let {exp} = req.params;

    try {
        let model_pack = getModelPack(exp);
        const runs = await model_pack.records.distinct("RunningName");

        res.json({
            runs
        });
    } catch (e) {

        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getExpRuns user=${req.user.id}`,
            sync: false
        });
        return res.status(400).json({error: 'Error'});
    }
});

// @desc    Get Filters
// @route   GET /api/get_filters/
// @access  Private
const getRunVers = asyncHandler(async (req, res) => {
    console.log("---> getRunVers")

    let {exp, run} = req.body;

    try {
        let new_filters = {};
        if (run.length > 0) {
            new_filters['$or'] = [];
            for (let i = 0; i < run.length; i++) {
                new_filters['$or'].push({
                    RunningName: run[i]
                });
            }
        }

        let model_pack = getModelPack(exp);
        const vers = await model_pack.records.find(new_filters).distinct("Version");

        res.json({
            vers
        });
    } catch (e) {

        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getRunVers user=${req.user.id}`,
            sync: false
        });
        return res.status(400).json({error: 'Error'});
    }
});

// @desc    Get Filters
// @route   GET /api/get_filters/
// @access  Private
const getRunVerUsers = asyncHandler(async (req, res) => {
    console.log("---> getRunVerUsers")
    let {exp, run, ver} = req.body;

    try {
        let model_pack = getModelPack(exp);
        const users = await model_pack.records.find({RunningName: run, Version: ver}).distinct("UserId");

        res.json({
            users
        });
    } catch (e) {

        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getRunVerUsers user=${req.user.id}`,
            sync: false
        });
        return res.status(400).json({error: 'Error'});
    }
});


// @desc    Get Data
// @route   GET /api/get_data/
// @access  Private
const getData = asyncHandler(async (req, res) => {
    console.log("---> getData")
    try {
        let {exp, filters, tables, EXCEL, deepFold} = req.body;
        console.log(req.body)
        let model_pack = getModelPack(exp);

        let filters_create = [];
        for (let f in filters) {
            if (filters[f] !== null && filters[f] !== '' && filters[f] !== 'All')
                filters_create.push({
                    filter: f,
                    value: filters[f],
                })
        }

        const filters_ordered = filtersCreate(filters_create);

        let records_data = await model_pack.records.find(filters_ordered).sort({UserId: 1});

        let records_ordered = [];

        if (!records_data)
            return res.json({
                records_ordered
            });
        for (let i = 0; i < records_data.length; i++) {

            let records = records_data[i]['_doc'];
            let temp_records = {};
            if (tables.includes('Payment')) {
                temp_records['Payment'] = Object.assign(
                    {
                        ID: records.Records.KeyTable.ID,
                        ExpID: records._id.toString(),
                        RunningName: records.RunningName,
                        Version: records.Records.KeyTable.Version
                    },
                    records.Records['Payment']
                );
            }
            if (tables.includes('UserDetails')) {
                temp_records['UserDetails'] = Object.assign(
                    {
                        ID: records.Records.KeyTable.ID,
                        ExpID: records._id.toString(),
                        RunningName: records.RunningName,
                        Version: records.Records.KeyTable.Version
                    }, records.Records['UserDetails']
                );
            }
            if (tables.includes('KeyTable')) {
                temp_records['KeyTable'] = Object.assign({
                    ExpID: records._id.toString(),
                    RunningName: records.RunningName
                }, records.Records['KeyTable']);
            }
            if (tables.includes('Summary')) {
                temp_records['Summary'] = Object.assign(
                    {
                        ID: records.Records.KeyTable.ID,
                        ExpID: records._id.toString(),
                        RunningName: records.RunningName,
                        Version: records.Records.KeyTable.Version
                    }, records.Records['Summary']
                );
            }

            let tables_of_record = Object.keys(records.Records);
            tables_of_record = tables_of_record.filter(
                t => (
                    t !== '_id' && t !== '__v' && t !== 'Payment' && t !== 'UserDetails' &&
                    t !== 'KeyTable' && t !== 'Summary'
                )
            );

            if (tables_of_record.includes('Game')) {
                if (tables.includes('Game'))
                    temp_records['Game'] = addLineToGame(records, true);
                else {
                    if (!Array.isArray(records.Records.Game)) {
                        for (let game_table in records.Records.Game)
                            if (tables.includes(game_table))
                                temp_records[game_table] = addLineToGame(records, false, game_table);
                    }
                }
            }

            if (Object.keys(temp_records).length > 0)
                records_ordered.push(temp_records);
        }

        // if (tables.includes('Game')

        res.json({
            records_ordered: stringify(records_ordered)
        });
    } catch (e) {

        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `getData user=${req.user.id}`,
            sync: false
        });
        return res.status(400).json({error: 'Error'});
    }
});


function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}


function flattenObject(obj, prefix = '') {
    const result = {};
    for (const key in obj) {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}-${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, fullKey));
        } else {
            result[fullKey] = value;
        }
    }
    return result;
}

/**
 *
 * @param result{object[]}
 * @return {null|object }
 */
const getGameDeepFolded = (result) => {
    const experiment = []

    result.forEach((obj) => {
        if (!"Game" in obj) {
            return null
        }
        const currentGame = obj["Game"];
        Object.values(currentGame).forEach((userOutput) => {
            if (!userOutput || !isObject(userOutput)) {
                return;
            }
            experiment.push(flattenObject(userOutput));
        })

    })

    return experiment;
}

const downloadData = asyncHandler(async (req, res) => {

    let {exp, filters, deepFold, EXCEL} = req.query;
    console.log('---> downloadData()    Runnings:', filters.runnings, 'Versions:', filters.versions, 'Users:', filters.users, 'Permissions:', filters.permissions);
    try {
        //     return res.status(400).json({Error: 'No tables'});
        // const IP = req.headers['x-real-ip'] || '0.0.0.0';
        //
        // filters = JSON.parse(filters);
        //
        // // tables = JSON.parse(tables);
        //
        let model_pack = getModelPack(exp);
        //
        const exp_path = 'TempReports/';
        if (!fs.existsSync(exp_path)) {
            try {
                fs.mkdirSync(exp_path);
            } catch (e) {
                return res.json({error: "Download files failed, "});
            }
        }
        //
        let filters_create = [];

        if (filters.runnings && filters.runnings.length > 0) {
            filters_create.push({
                RunningName: {$in: filters.runnings}
            });
        }
        if (filters.versions && filters.versions.length > 0) {
            filters_create.push({
                Version: {$in: filters.versions}
            });
        }
        if (filters.permissions && filters.permissions.length > 0) {
            filters_create.push({
                Permission: {$in: filters.permissions}
            });
        }
        if (filters.users && filters.users.length > 0) {
            filters_create.push({
                UserId: {$in: filters.users}
            });
        }

        console.log("Final Query:", JSON.stringify(filters_create, null, 2));
        // if (filters.users.length > 0){
        //     filters_create.push({
        //         UserId: {$in: filters.users}
        //     });
        // }

        let match_filters = {
            $and: [
                {
                    "Records.Game": {"$exists": true}
                },
                {
                    $expr: {
                        $gt: [{$size: ExpGameDataSize(exp)}, 0]
                    }
                }
                // {'Records.Game': { $size: {$gt: 0} }}
            ]
        };
        if (filters_create.length > 0) {
            for (let i = 0; i < filters_create.length; i++) {
                match_filters.$and.push(filters_create[i]);
            }
        }
        // let results2 = await model_pack.records.aggregate([
        //     {"$match" : match_filters},
        //     {
        //         $group: {
        //             _id: null,
        //             Game: {$push: '$Records.Game'},
        //             UserDetails: {$push: '$Records.UserDetails'},
        //             KeyTable: {$push: '$Records.KeyTable'},
        //             Summary: {$push: '$Records.Summary'},
        //             Payment: {$push: '$Records.Payment'},
        //         }
        //     },
        //     // {$group: {
        //     //         _id: null,
        //     //         Game: {$addToSet: '$Records.Game'},
        //     //         UserDetails: {$addToSet: '$Records.UserDetails'},
        //     //         KeyTable: {$addToSet: '$Records.KeyTable'},
        //     //         Summary: {$addToSet: '$Records.Summary'},
        //     //         Payment: {$addToSet: '$Records.Payment'},
        //     //     }
        //     // }
        // ]);

        let $group = {
            "_id": '$_id',
            ...ExpGameGroup(exp),
            // Game: {$push: '$Records.Game.PL'},
            // Game: {$push: { $sum: 1 }},
            // Game: {$push: '$Records.Game'},
            UserDetails: {$push: '$Records.UserDetails'},
            KeyTable: {$push: '$Records.KeyTable'},
            Summary: {$push: '$Records.Summary'},
            Payment: {$push: '$Records.Payment'}
        };

        let $project = {
            ...ExpGameProject(exp),
            // Game: '$Records.Game',
            UserDetails: '$Records.UserDetails',
            KeyTable: '$Records.KeyTable',
            Summary: '$Records.Summary',
            Payment: '$Records.Payment',
            // [ExpMoreRec(exp)]: '$Records.MoreRec.'+ExpMoreRec(exp),
        };
        const expMoreRec = ExpMoreRec(exp);

        if (expMoreRec) {
            if (Array.isArray(expMoreRec)) {
                for (let i = 0; i < expMoreRec.length; i++) {
                    $group[expMoreRec[i]] = {$push: '$Records.MoreRec.' + expMoreRec[i]};
                    $project[expMoreRec[i]] = '$Records.MoreRec.' + expMoreRec[i];
                }
            } else {
                $group[expMoreRec] = {$push: '$Records.MoreRec.' + expMoreRec};
                $project[expMoreRec] = '$Records.MoreRec.' + expMoreRec;
            }
        }


        // let results3 = await model_pack.records.find(match_filters).select('-_id Records');

        let results3 = await model_pack.records.aggregate([
            {"$match": match_filters},
            {$project},
            // { "$group": $group3},
            // { $project: { Records: 1 } },
            // { "$addFields":
            //         {
            //             ...ExpGameAddFields(exp),
            //             // "Game": {
            //             //     "$reduce": {
            //             //         "input": "$Game",
            //             //         "initialValue": [],
            //             //         "in": { "$concatArrays": [ "$$value", "$$this" ] }
            //             //     }
            //             // },
            //             "Summary": {
            //                 "$filter": {
            //                     "input": "$Summary",
            //                     // as: "item",
            //                     cond: { $ne: [{ $type: "$$this.ID" }, "missing"] }
            //                     // cond: { $eq: [{ $type: "$$this.ID" }, {$ne: "missing"}] }
            //                     // "cond": { "$eq": [ "$$this.ID", undefined ] }
            //                 }
            //             }
            //         },
            // },
        ]).allowDiskUse(true);

        if (!results3 || (results3.length === 0))
            return res.status(500).json({error: "Download files failed, ", results3});
        let zip = new JSZip();

        for (let key in $project) {

            let key_res = results3.reduce((a, b) => {
                if (!b[key]) return a;
                // console.log('key', key, '  b[key]', typeof b[key], b[key]);
                try {
                    return [...a, ...b[key]];
                } catch (e) {
                    return [...a, {...b[key]}];
                }
            }, []);

            if (deepFold === true ||deepFold === "true"  && key === "Game") {
                key_res = getGameDeepFolded(results3);
            }
            if (key_res.length) {
                if (EXCEL === 'true') {
                    const workbook = new ExcelJS.Workbook();
                    const worksheet = workbook.addWorksheet(key);
                    const allKeys = Array.from(new Set(key_res.flatMap(obj => Object.keys(obj))));

                    worksheet.columns = allKeys.map(col => ({
                        header: col,
                        key: col
                    }));

                    worksheet.addRows(key_res);
                    const buffer = await workbook.xlsx.writeBuffer();
                    zip.file(`${key}.xlsx`, buffer);
                } else {
                    const csv = new ObjectsToCsv(key_res);
                    const csv_str = await csv.toString(true, true);
                    zip.file(`${key}.csv`, csv_str);
                }
            }
        }

        // for (let i=0; i<results3.length; i++){
        //     let r = results3[i];
        //     for (let t_key in r){
        //         if (t_key !== '_id' && r[t_key] && r[t_key].length) {
        //             const csv = new ObjectsToCsv(r[t_key]);
        //             const csv_str = await csv.toString(true, true);
        //             // const csv_str2 = await csv.toDisk(`./${exp_path}/${t_key}.csv`, {allColumns: true});
        //             // console.log('t_key',t_key);
        //             zip.file(t_key + '.csv', csv_str);
        //         }
        //         else {
        //             // console.log('r[t_key]',r[t_key]);
        //         }
        //     }
        // }
        let file_name = exp_path + req.user.id + '_' + exp + '.zip';

        zip
            .generateNodeStream({type: 'nodebuffer', streamFiles: true})
            .pipe(fs.createWriteStream(file_name))
            .on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                return res.download(file_name, (err) => {
                    fs.unlinkSync(file_name);
                })
            });
    } catch (e) {
        console.log('e', e);
        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `downloadData user=${req.user.id}`,
            sync: false
        });
        return res.status(500).json({error: 'Error'});
    }
});

const wpImages = asyncHandler(async (req, res) => {
    console.log("---> wpImages")
    // let {exp, filters} = req.query;
    // const IP = req.headers['x-real-ip'] || '0.0.0.0';
    //
    // filters = JSON.parse(filters);
    //
    // // tables = JSON.parse(tables);
    //
    // let model_pack = getModelPack(exp);
    //
    //
    // const exp_path = 'WpImagesTempReports/';
    // if (!fs.existsSync(exp_path)){
    //     try {
    //         fs.mkdirSync(exp_path);
    //     }
    //     catch (e) {
    //         return res.json({ Error: "Download files failed, "});
    //     }
    // }
    //
    // let filters_create = [];
    //
    // if (filters.runs_selected.length > 0){
    //     filters_create.push({
    //         RunningName: {$in: filters.runs_selected}
    //     });
    // }
    //
    // if (filters.vers_selected.length > 0){
    //     filters_create.push({
    //         Version: {$in: filters.vers_selected}
    //     });
    // }
    //
    // if (filters.users_selected.length > 0){
    //     filters_create.push({
    //         UserId: {$in: filters.users_selected}
    //     });
    // }
    //
    // let match_filters = {};
    // if (filters_create.length > 0){
    //     match_filters.$and = [];
    //     for (let i=0; i<filters_create.length; i++){
    //         match_filters.$and.push(filters_create[i]);
    //     }
    // }
    //
    // let results = model_pack.records.find(match_filters, async function(err, docs) {
    //     if (err) return res.json({ Error: "Download files failed, "});
    //
    //     if (docs.length === 0) return res.json({ Error: "Download files failed, "});
    //
    //     let data = {};
    //
    //     const width = 1200;
    //     const height = 630;
    //
    //     const canvas = createCanvas(width, height);
    //     const context = canvas.getContext('2d');
    //
    //     context.fillStyle = '#000';
    //     context.fillRect(0, 0, width, height);
    //
    //     context.font = 'bold 70pt Menlo';
    //     context.textAlign = 'center';
    //     context.textBaseline = 'top'
    //     context.fillStyle = '#3574d4'
    //
    //     const text = 'Hello, World!'
    //
    //     const textWidth = context.measureText(text).width
    //     context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
    //     context.fillStyle = '#fff'
    //     context.fillText(text, 600, 170)
    //
    //     context.fillStyle = '#fff'
    //     context.font = 'bold 30pt Menlo'
    //     context.fillText('flaviocopes.com', 600, 530)
    //
    //     const buffer = canvas.toBuffer('image/png')
    //     fs.writeFileSync('./test.png', buffer)
    // });
});

// @desc    remove DATA
// @route   DELETE /api/delete_data/
// @access  Private
const deleteData = asyncHandler(async (req, res) => {
    console.log("---> deleteData")
    const {exp, user_id} = req.query;

    try {
        let model_pack = getModelPack(exp);

        if (user_id.includes('ALL_USERS'))
            await model_pack.records.deleteMany();
        else
            await model_pack.records.deleteMany({UserId: user_id});

        Logger({
            logs_target: exp,
            logs_extension: '.log',
            data: `deleteData user=${req.user.id}`,
            sync: false
        });

        res.json({msg: 'Record deleted', status: "OK"});
    } catch (e) {

        Logger({
            logs_target: exp,
            logs_extension: '.err',
            data: `deleteData user=${req.user.id}`,
            sync: false
        });
        return res.status(400).json({error: 'Error'});
    }
})


module.exports = {
    getFilters,
    getData,
    deleteData,
    getExpRuns,
    getRunVers,
    getRunVerUsers,
    downloadData,
    wpImages
}
