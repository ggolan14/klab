const asyncHandler = require('express-async-handler');
const {getModelPack} = require('../models/models');
const {getTimeDate} = require('../utils');
const fs = require("fs");
const {getConnectionsHandle} = require("../Struct/users_list");

const TodoModel = getModelPack('ToDoList').ToDoList;
const AppSettingsModel = getModelPack('AppSettings').AppSettings;

const ExpTodoFilesPath = 'uploads/Todo/';

// @desc    Create new TodoList
// @route   POST /api/todo
// @access  Private
const addTodoList = asyncHandler(async (req, res) => {
    try {
        const {
            exp, open_by, subject, description, direction, status, no_files
        } = req.body;

        let todo_item = new TodoModel({exp, open_by, subject, description, direction, status});
        await todo_item.save();

        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});

        if (!todo_queue){
            todo_queue = new AppSettingsModel({
                set_key: 'todo_queue',
                data: [exp]
            });
            await todo_queue.save();
        }
        else {
            let data = todo_queue.data;

            if (data.indexOf(exp) === -1) {
                data.push(exp);

                await AppSettingsModel.updateOne(
                    {set_key: 'todo_queue'},
                    {$set: {data}}
                );
                todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
            }
        }

        if (no_files){
            todo_queue = todo_queue.data;
            let connections_handle = getConnectionsHandle();
            connections_handle.broadcastToRoom(exp, 'NEW_TODO', {todo_item, todo_queue});
        }
        return res.json({msg: 'Todo add success', todo_item});
    }
    catch (e) {
        return res.json({error: 'Some Error happened'})
    }
});

const updateTodoQueue = asyncHandler(async (req, res) => {
    try {
        const {todo_queue} = req.body;

        await AppSettingsModel.updateOne(
            {set_key: 'todo_queue'},
            {$set: {data: todo_queue}}
        );

        let queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        queue = queue.data;

        let connections_handle = getConnectionsHandle();
        connections_handle.broadcastToAllClients('UPDATE_TODO_QUEUE', queue);

        return res.json({msg: 'Todo update success'})
    }
    catch (e) {
        return res.json({error: 'Some Error happened'})
    }
});

const addFilesOfTodoList = asyncHandler(async (req, res) => {
    try {
        let {exp, todo_id, is_new} = req.params;
        const TYPE_MSG = is_new === 'YES'?'NEW_TODO':'UPDATE_TODO';
        let todo_item = await TodoModel.findById(todo_id);
        if (!todo_item)
            return res.json({error: 'Todo not found'});

        if (!fs.existsSync(ExpTodoFilesPath)){
            fs.mkdirSync(ExpTodoFilesPath);
        }

        let path = ExpTodoFilesPath + exp + '/';

        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

        path += (todo_id + '/');

        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

        const file = req.files.file;

        const files_error = [];

        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        todo_queue = todo_queue.data;

        if (Array.isArray(file)){
            for (let i=0; i<file.length; i++){

                await file[i].mv(`${path}${file[i].name}`, async (err) => {

                    if (err) {
                        files_error.push(file[i].name);
                    }
                    else {
                        todo_item = await TodoModel.findById(todo_id);
                        todo_item.files.push(file[i].name);
                        await todo_item.save();
                    }

                    if (i === (file.length-1)){
                        let connections_handle = getConnectionsHandle();
                        connections_handle.broadcastToRoom(exp, TYPE_MSG, {todo_item, todo_queue});

                        return res.json({msg: 'Upload files success', files_error});
                    }
                });
            }

        }
        else {
            await file.mv(`${path}${file.name}`, async (err) => {

                if (err) {
                    files_error.push(file.name);
                }
                else {
                    todo_item.files.push(file.name);
                    await todo_item.save();
                }

                let connections_handle = getConnectionsHandle();
                connections_handle.broadcastToRoom(exp, TYPE_MSG, {todo_item,  todo_queue});

                return res.json({msg: 'Upload file success', files_error});
            });
        }

    } catch (err) {
        return res.json({error: 'Error occurs'});
    }
});

// @desc    Get TodoList
// @route   GET /api/todo/
// @access  Private
const getTodoList = asyncHandler(async (req, res) => {

    const {exp} = req.query;

    let todoList = await TodoModel.findOne({exp});

    if (todoList) {
        res.json(todoList);
    } else {
        res.status(404);
        return res.json({error: 'Todo not found'});
    }
});

// @desc    Update TodoList
// @route   PUT /api/todo/
// @access  Private
const updateTodoList = asyncHandler(async (req, res) => {
    try {
        let {
            id, subject, description, direction, status
        } = req.body;

        let todo_item = await TodoModel.findById(id);
        if (!todo_item)
            return res.json({error: 'Todo not found'});

        if (todo_item.subject.localeCompare(subject) || todo_item.description.localeCompare(description)) {
            status = 'SENT';
        }

        todo_item.subject = subject;
        todo_item.description = description;
        todo_item.direction = direction;
        todo_item.status = status;
        await todo_item.save();

        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        let data = todo_queue.data;

        if (status === 'DONE' || status === 'FREEZE' || status === 'CANCELED'){
            if (todo_queue){
                if (data.indexOf(todo_item.exp) > -1) {
                    data = data.filter(exp => exp !== todo_item.exp);

                    await AppSettingsModel.updateOne(
                        {set_key: 'todo_queue'},
                        {$set: {data}}
                    );
                }
            }
        }
        else {
            if (!todo_queue){
                todo_queue = new AppSettingsModel({
                    set_key: 'todo_queue',
                    data: [todo_item.exp]
                });
                await todo_queue.save();
            }
            else {

                if (data.indexOf(todo_item.exp) === -1) {
                    data.push(todo_item.exp);

                    await AppSettingsModel.updateOne(
                        {set_key: 'todo_queue'},
                        {$set: {data}}
                    );
                }
            }
        }

        todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        todo_queue = todo_queue.data;
        let connections_handle = getConnectionsHandle();
        connections_handle.broadcastToRoom(todo_item.exp, 'UPDATE_TODO', {todo_item, todo_queue});
        return res.json({msg: 'Todo update success'});
    }
    catch (e) {
        return res.json({error: 'Some Error happened'})
    }
});

// @desc    remove TodoList
// @route   DELETE /api/todo/
// @access  Private
const deleteTodoList = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;

        let todo_item = await TodoModel.findById(id);

        if (!todo_item)
            return res.json({error: 'Todo not found'});
        let exp = todo_item.exp;
        await TodoModel.findByIdAndDelete(id);

        let path = ExpTodoFilesPath + exp + '/' + id + '/';
        fs.rmSync(path, { recursive: true, force: true });

        let exp_todo_list = await TodoModel.find({exp });

        let exist_todo_not_done = false;
        for (let i=0; i<exp_todo_list.length; i++) {
            const status = exp_todo_list[i].status;
            if (status === 'SENT' || status === 'ACCEPT' || status === 'DEV') {
                exist_todo_not_done = true;
                break;
            }
        }

        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        if (todo_queue){
            let data = todo_queue.data;

            if (!exist_todo_not_done){
                if (data.indexOf(exp) > -1)
                    data = data.filter(exp_ => exp_ !== exp);
            }
            else {
                if (data.indexOf(exp) === -1)
                    data.push(exp);
            }

            await AppSettingsModel.updateOne(
                {set_key: 'todo_queue'},
                {$set: {data}}
            );

            /// LOGS WHO DELETE

            todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
            todo_queue = todo_queue.data;

            let connections_handle = getConnectionsHandle();
            connections_handle.broadcastToRoom(exp, 'REMOVE_TODO', {todo_item: {exp,id}, todo_queue});
            return res.json({msg: 'Todo delete success'});
        }
    }
    catch (e) {
        return res.json({error: 'Some Error happened'})
    }
});

const deleteTodoFile = asyncHandler(async (req, res) => {
    try {
        const {exp, file_name, todo_id} = req.params;

        let todo_item = await TodoModel.findById(todo_id);

        if (!todo_item)
            return res.json({error: 'Todo not found'});

        let path = ExpTodoFilesPath + exp + '/' + todo_id + '/' + file_name;
        if (!fs.existsSync(path)){
            return res.json({error: 'File not found'});
        }

        fs.unlinkSync(path);
        todo_item.files = todo_item.files.filter(file_ => file_ !== file_name);
        await todo_item.save();

        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
        todo_queue = todo_queue.data;

        let connections_handle = getConnectionsHandle();
        connections_handle.broadcastToRoom(todo_item.exp, 'UPDATE_TODO', {todo_item, todo_queue});

        return res.json({msg: 'File delete success'});
    }
    catch (e) {
        return res.json({error: 'Error'});
    }

})

const uploadTodoFiles = asyncHandler(async (req, res) => {
    try {
        let {exp, todo_id} = req.params;
        let path = ExpTodoFilesPath + exp + '/';

        let todo_item = await TodoModel.findById(todo_id);
        if (!todo_item)
            return res.json({error: 'Todo not found'});

        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

        path += (todo_id + '/');

        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

        const file = req.files.file;

        let files_error = [];

        if (Array.isArray(file)){
            for (let i=0; i<file.length; i++){
                await file[i].mv(`${path}${file[i].name}`, async (err) => {

                    if (err) {
                        files_error.push(file[i].name);
                    }
                    else {
                        todo_item = await TodoModel.findById(todo_id);
                        todo_item.files.push(file[i].name);
                        await todo_item.save();
                    }


                    if (i === (file.length-1)){
                        let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
                        todo_queue = todo_queue.data;
                        let connections_handle = getConnectionsHandle();
                        connections_handle.broadcastToRoom(todo_item.exp, 'UPDATE_TODO', {todo_item, todo_queue});

                        return res.json({msg: 'Upload files success', files_error});
                    }
                });
            }

        }
        else {
            await file.mv(`${path}${file.name}`, async (err) => {
                if (err) {
                    files_error.push(file.name);
                }
                else {
                    todo_item.files.push(file.name);
                    await todo_item.save();

                    let todo_queue = await AppSettingsModel.findOne({set_key: 'todo_queue'});
                    todo_queue = todo_queue.data;
                    let connections_handle = getConnectionsHandle();
                    connections_handle.broadcastToRoom(todo_item.exp, 'UPDATE_TODO', {todo_item, todo_queue});

                    return res.json({msg: 'Upload file success', files_error});
                }
            });
        }

    } catch (err) {
        return res.json({error: 'Error occurs'});
    }
});

const downloadTodoFile = asyncHandler(async (req, res) => {

    try {
        const {exp, todo_id, file_name} = req.query;
        let path = ExpTodoFilesPath + exp + '/' + todo_id + '/' + file_name;
        if (!fs.existsSync(path)){
            return res.json({error: 'File not found'});
        }

        return res.download(path, (err)=>{

        })
    }
    catch (err) {
        return res.json({error: 'Error occurs'});
    }
})

module.exports = {
    addTodoList,
    updateTodoQueue,
    getTodoList,
    updateTodoList,
    deleteTodoList,
    addFilesOfTodoList,
    deleteTodoFile,
    uploadTodoFiles,
    downloadTodoFile
}
