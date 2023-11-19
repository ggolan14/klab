const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const expDevDetailsModel = getModelPack('ExpDevDetails').ExpDevDetails;
const UserModel = getModelPack('User').User;
const ChatsModel = getModelPack('Chats').Chats;
const ToDoListModel = getModelPack('ToDoList').ToDoList;
const AppSettingsModel = getModelPack('AppSettings').AppSettings;

const MailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const isSuperAdminUser = async req => {
    const user_admin = await UserModel.findById(req.user.id);
    return user_admin.permission === 'SuperAdmin';

}

// @desc    Authenticate user & get token
// @route   POST /api/auth
// @access  Public
const userAuthenticate = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;

    try {
        let user = await UserModel.findOne({email: email.toLowerCase()});

        if (!user) {
            return res
                .status(400)
                .json({errors: [{msg: 'Authentication is failed'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({errors: [{msg: 'Authentication is failed'}]});
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 86400},
            (err, token) => {
                if (err) throw err;
                res.json({token});
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @desc    User Authentication
// @route   GET /api/auth/
// @access  Private
const userAuthentication = asyncHandler(async (req, res) => {

    try {
        const user = await UserModel.findById(req.user.id).select('-password');

        const user_exps = user.Experiments;
        let chats = {}, todo_list = {};
        for (let i=0; i<user_exps.length; i++){
            chats[user_exps[i]] = await ChatsModel.find({exp: user_exps[i]});
            todo_list[user_exps[i]] = (await ToDoListModel.find({exp: user_exps[i]})).reverse();
        }

        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        if (!todo_queue){
            todo_queue = new AppSettingsModel({
                set_key: 'todo_queue',
                data: []
            });
            await todo_queue.save();
        }
        todo_queue = todo_queue.data;

        // const chats = await ChatsModel.findOne({exp});
        return res.json({
            user,
            chats,
            todo_list,
            todo_queue: todo_queue || []
        });
    }
    catch (e) {
        return res
            .status(400)
            .json({errors: [{msg: 'Server error'}]});
    }
});

// @desc    Add New Users
// @route   POST /api/add_users
// @access  Private
const AddNewUsers = asyncHandler(async (req, res) => {

    if (!(await isSuperAdminUser(req)))
        return res.json({error: 'illegal command'});

    let {users_list} = req.body;

    let users_errors = [], users_added = [];
    let insert_users = [];

    for (let i=0; i<users_list.length; i++){
        let user_exist = await UserModel.findOne({email: users_list[i].toLowerCase()});
        if (user_exist || !users_list[i].match(MailFormat))
            users_errors.push(users_list[i]);
        else {
            users_added.push(users_list[i]);
            insert_users.push( {
                name: '',
                email: users_list[i].toLowerCase(),
                password: bcrypt.hashSync('12345', 10),
                permission: 'Admin',
                gender: 'Male',
                age: 1,
                Experiments: [],
                chat_last_seen: {}
            });
        }
    }

    await UserModel.insertMany(insert_users);

    let exps_list = await expDevDetailsModel.distinct('exp');
    users_list = await UserModel.find().select('_id email Experiments');
    res.json({users_added, users_errors, exps_list, users_list})
});

// @desc    Update user Experiments
// @route   PUT /api/modify_user
// @access  Private
const ModifyUser = asyncHandler(async (req, res) => {

    try {
        if (!(await isSuperAdminUser(req)))
            return res.json({error: 'illegal command'});

        const {id, Experiments} = req.body;

        let user = await UserModel.findById(id);

        if (!user){
            return res.json({error: 'User dont exist'})
        }
        user.Experiments = Experiments;
        for (let i=0; i<Experiments.length; i++){
            if (user.chat_last_seen[Experiments[i]] === undefined)
                user.chat_last_seen[Experiments[i]] = 0;
        }

        await user.save();

        let exps_list = await expDevDetailsModel.distinct('exp');
        let users_list = await UserModel.find().select('_id email Experiments');

        res.json({msg: 'Success', exps_list, users_list})
    }
    catch (e) {
        return res.json({error: 'Server error'});
    }
});

// @desc    Update user Experiments
// @route   PUT /api/modify_user
// @access  Private
const ChangeUserDet = asyncHandler(async (req, res) => {

    try {
        const {user_det} = req.body;

        if (req.user.id !== user_det.id)
            return res.json({error: 'illegal command'});

        let user = await UserModel.findById(user_det.id);

        if (!user){
            return res.json({error: 'User dont exist'})
        }

        user.name = user_det.name;
        user.gender = user_det.gender;
        user.age = user_det.age;
        await user.save();

        res.json({msg: 'Success', user_changes: {
                name: user.name,
                gender: user.gender,
                age: user.age
            }})
    }
    catch (e) {
        return res.json({error: 'Server error'});
    }
});

// @desc    Update user Experiments
// @route   PUT /api/modify_user
// @access  Private
const ChangeUserPassword = asyncHandler(async (req, res) => {

    try {
        const {user_det} = req.body;

        if (req.user.id !== user_det.id)
            return res.json({error: 'illegal command'});

        let user = await UserModel.findById(user_det.id);

        if (!user){
            return res.json({error: 'User dont exist'})
        }

        user.password = user_det.new_val;
        await user.save();

        res.json({msg: 'Success'})
    }
    catch (e) {
        return res.json({error: 'Server error'});
    }
});

// @desc    Update user Experiments
// @route   PUT /api/modify_user
// @access  Private
const ResetPassword = asyncHandler(async (req, res) => {

    try {
        if (!(await isSuperAdminUser(req)))
            return res.json({error: 'illegal command'});

        const {id} = req.body;

        let user = await UserModel.findById(id);

        if (!user){
            return res.json({error: 'User dont exist'})
        }

        user.password = '12345';
        await user.save();

        res.json({msg: 'Success'});
    }
    catch (e){
        return res.json({error: 'Server error'});
    }
})

// @desc    Update user Experiments
// @route   PUT /api/modify_user
// @access  Private
const RemoveUser = asyncHandler(async (req, res) => {

    try {
        if (!(await isSuperAdminUser(req)))
            return res.json({error: 'illegal command'});

        const {id} = req.body;

        let user = await UserModel.findById(id);

        if (!user){
            return res.json({error: 'User dont exist'})
        }

        if (user.permission === 'SuperAdmin')
            return res.json({error: 'illegal command'});

        await UserModel.deleteMany({_id: id});

        let exps_list = await expDevDetailsModel.distinct('exp');
        let users_list = await UserModel.find().select('_id email Experiments');

        res.json({msg: 'Success', exps_list, users_list});
    }
    catch (e){
        return res.json({error: 'Server error'});
    }
});

// @desc    Update user Experiments
// @route   PUT /api/modify_user
// @access  Private
const GetUserInfo = asyncHandler(async (req, res) => {

    try {
        const {email} = req.params;

        let user = await UserModel.findOne({email}).select('name phone create_date gender age Experiments');

        if (!user){
            return res.json({error: 'User dont exist'})
        }

        res.json({user_info: user});
    }
    catch (e){
        return res.json({error: 'Server error'});
    }
})

module.exports = {
    userAuthenticate,
    userAuthentication,
    AddNewUsers,
    ModifyUser,
    ResetPassword,
    RemoveUser,
    ChangeUserDet,
    ChangeUserPassword,
    GetUserInfo
}
