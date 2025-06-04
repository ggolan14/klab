const express = require('express');
const router = express.Router();
const {LoggersErrors, LoggersGames} = require('../../models/all_models/Loggers');
const {OutsourcePlayIP} = require('../../models/all_models/OutsourcePlayIP');
const {getTimeDate} = require('../../utils');
const auth = require('../../middleware/auth');


// KeyTable insert bonus column
const logToFile = (Exp) => {

}

// From out source
const OutExpConvertor = {
    WordPuzzle: 'wp'
}

const NewLog = async ({ logs, IP }) => {
    const date = getTimeDate();
    try{
        let new_log_obj = {
            user_id: logs.user_id,
            exp: logs.exp,
            ip: IP,
            running_name: logs.running_name,
            action: logs.action,
            more_params: logs.more_params,
            date: date.date,
            time: date.time,
        };
        let new_log;

        if (logs.type === 'LogGameType'){
            new_log = new LoggersGames(new_log_obj);
        }
        else if (logs.type === 'LogErrorType'){
            new_log = new LoggersErrors(new_log_obj);
        }

        await new_log.save();
    }
    catch (e) {

    }

}

router.post('/', async (req, res) => {

    const { logs } = req.body;
    let IP = req.headers['x-real-ip'] || '0.0.0.0';
    try {
        await NewLog({ logs, IP });

        return res
            .json({ msg: 'Logs success', status: "OK" });
    } catch (err) {
        console.error(err.message);
        let user_id = '', exp = '', running_name = '', permission = '';

        if (logs.user_id !== undefined) user_id = logs.user_id;
        if (logs.exp !== undefined) exp = logs.exp;
        if (logs.running_name !== undefined) running_name = logs.running_name;
        if (logs.permission !== undefined) permission = logs.permission;

        await NewLog({logs: {action: 'LoggerError', user_id, exp, running_name, permission}, LogErrorType: 'LogErrorType'})
        res.status(500).send('Server Error p/settings');
    }
});


router.get('/logs_runs/:exp', auth, async (req, res) => {

    const {exp} = req.params;

    try {
        // let LoggersGamesExps = await LoggersGames.aggregate([
        //     {"$match" : {exp}},
        //     {$group: {
        //             _id: null,
        //             running_name: {$addToSet: '$running_name'},
        //             user_id: {$addToSet: '$user_id'},
        //         }}
        // ]);
        let LoggersGamesExps = await LoggersGames.find({exp}).distinct('running_name');


        if (LoggersGamesExps.length > 0){
            LoggersGamesExps = LoggersGamesExps.filter(run => run !== '');
            return res.json({ runs: LoggersGamesExps});
            // return res.json({ runnings: LoggersGamesExps[0].running_name, users: LoggersGamesExps[0].user_id});
        }
        // let LoggersGamesExps = await LoggersGames.find({exp}).distinct('running_name user_id');

        return res.json({ runs: [], status: "OK" });
        // let LoggersErrorsExps = await LoggersErrors.find().distinct('exp');

        // let merge = [].concat(LoggersGamesExps).concat(LoggersErrorsExps);

        // merge = new Set(merge);
        // merge = Array.from(merge);
        // return res.json({ exps_list: merge, status: "OK" });
    } catch (err) {
        return res.json({ error: 'error' });

    }
});

router.get('/users_of_run/:exp&:run', auth, async (req, res) => {

    const {exp, run} = req.params;

    try {
        let filters = {exp};
        if (run !== 'All')
            filters.running_name = run;

        let LoggersGamesExps = await LoggersGames.find(filters).distinct('user_id');

        if (LoggersGamesExps.length > 0){
            return res.json({ users: LoggersGamesExps});
        }

        return res.json({ users: [], status: "OK" });

    } catch (err) {
        return res.json({ error: 'error' });

    }
});

router.post('/logs_of_users/', auth, async (req, res) => {

    const {exp, run, user_id} = req.body;

    try {
        let filters = {exp, user_id};
        if (run !== 'All')
            filters.running_name = run;

        let LoggersGamesExps = await LoggersGames.find(filters);


        if (LoggersGamesExps.length > 0){
            return res.json({ logs: LoggersGamesExps});
        }

        return res.json({ logs: [], status: "OK" });

    } catch (err) {
        return res.json({ error: 'error' });

    }
});

router.post('/outs_ip_logs/', auth, async (req, res) => {

    const {exp, ip, user_id} = req.body;

    try {
        const exp_ = OutExpConvertor[exp];
        let OutSourceLogsIp = await OutsourcePlayIP.find({exp: exp_, ip});
        let OutSourceLogsId = await OutsourcePlayIP.find({exp: exp_, userId: user_id});

        const OutLogs = {
            ByIp: OutSourceLogsIp,
            ById: OutSourceLogsId
        }

        return res.json({ out_logs: OutLogs, status: "OK" });

    } catch (err) {
        return res.json({ error: 'error' });

    }
});


module.exports = router;
