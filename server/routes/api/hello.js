const express = require('express');
const router = express.Router();
const {getTimeDate} = require('../../utils');
const {getModelPack} = require('../../models/models');
const Logger = require("../../logger");

router.get('/:exp', async (req, res) => {
    let IP = req.headers['x-real-ip'] || '0.0.0.0';
    const {exp} = req.params;

    let out_users_model = getModelPack('OutsourcePlayIP').OutsourcePlayIP;

    let date = getTimeDate();
    let out_user = new out_users_model({
        exp,
        ip: IP,
        type: 'REDIRECT',
        userId: '-',
        date: date.date,
        time: date.time,
    });

    // await out_user.save();

    let new_records = out_user.save();
    new_records.then(function (doc) {
        res.json({msg: 'hello'});
        // use doc
    });
});

router.post('/', async (req, res) => {
    let IP = req.headers['x-real-ip'] || '0.0.0.0';
    const {exp, user_id} = req.body;

    let out_users_model = getModelPack('OutsourcePlayIP').OutsourcePlayIP;

    let date = getTimeDate();
    let out_user = new out_users_model({
        exp,
        ip: IP,
        type: 'LOGIN',
        userId: user_id,
        date: date.date,
        time: date.time,
    });

    let new_records = out_user.save();
    new_records.then(function (doc) {
        res.json({msg: 'hello'});
        // use doc
    });

    // await out_user.save();
});


module.exports = router;
