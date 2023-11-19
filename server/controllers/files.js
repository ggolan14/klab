const asyncHandler = require('express-async-handler');
const {getTimeDate} = require('../utils');
const fs = require('fs');
const {getModelPack} = require('../models/models');
const {getConnectionsHandle} = require("../Struct/users_list");

const ChatsModel = getModelPack('Chats').Chats;

const ExpDevFilesPath = 'uploads/ExpDev/', ExpChatFilesPath = 'uploads/ExpChat/';
// @desc    Upload Exp Dev Files
// @route   POST /api/file/:exp
// @access  Private
const uploadFiles = asyncHandler(async (req, res) => {
    try {
        let {exp, from, action} = req.params;

        let path;
        if (action === 'ExpDev')
            path = ExpDevFilesPath;
        else if (action === 'ExpChat')
            path = ExpChatFilesPath;

        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }

        const new_path = path + exp + '/';

        if (!fs.existsSync(new_path)){
            fs.mkdirSync(new_path);
        }

        // const folder_counter_path = new_path + 'counter.txt';

        // let folder_counter = 0;

        // if (!fs.existsSync(folder_counter_path)){
        //     fs.writeFile(folder_counter_path, '0', { flag: 'w+' }, err => {});
        // }

        const file = req.files.file;

        if (Array.isArray(file)){
            for (let i=0; i<file.length; i++){
                // folder_counter = Number(fs.readFileSync(folder_counter_path, 'utf8'));
                // fs.writeFile(folder_counter_path, `${folder_counter+1}`, { flag: 'w+' }, err => {});

                // const file_path = new_path + folder_counter + '/';
                // if (!fs.existsSync(file_path)){
                //     fs.mkdirSync(file_path);
                // }
                await file[i].mv(`${new_path}${file[i].name}`, async (err) => {

                    if (err) {
                        return res.json({ error: "Upload files failed, " + file[i].name});
                    }
                    let all_files = [];
                    if (action === 'ExpChat'){
                        let new_chat = new ChatsModel({
                            exp, from, message: `${file[i].name}`, m_type: 'FILE'
                        });

                        await new_chat.save();

                        let connections_handle = getConnectionsHandle();

                        connections_handle.broadcastToRoom(exp, 'NEW_CHAT_MSG', new_chat);
                    }


                    if (i === (file.length-1)){
                        if (action === 'ExpDev'){
                            fs.readdirSync(new_path).forEach(file => {
                                all_files.push(file);
                            });
                        }
                        return res.json({msg: 'Upload files success', all_files});
                    }
                });
            }

        }
        else {
            // folder_counter = Number(fs.readFileSync(folder_counter_path, 'utf8'));
            // fs.writeFile(folder_counter_path, `${folder_counter+1}`, { flag: 'w+' }, err => {});

            // const file_path = new_path + folder_counter + '/';
            // if (!fs.existsSync(file_path)){
            //     fs.mkdirSync(file_path);
            // }

            await file.mv(`${new_path}${file.name}`, async (err) => {
                if (err) {
                    return res.json({ error: "Upload file failed " + file.name});
                }
                else {
                    let all_files = [];

                    if (action === 'ExpChat'){
                        let new_chat = new ChatsModel({
                            exp, from, message: `${file.name}`, m_type: 'FILE'
                        });

                        await new_chat.save();

                        let connections_handle = getConnectionsHandle();
                        connections_handle.broadcastToRoom(exp, 'NEW_CHAT_MSG', new_chat);
                    }
                    else if (action === 'ExpDev'){
                        fs.readdirSync(new_path).forEach(file => {
                            all_files.push(file);
                        });
                    }

                    return res.json({msg: 'Upload file success', all_files});
                }
            });
        }

    } catch (err) {
        return res.json({error: 'Error occurs'});
    }
});

// @desc    Download Exp File
// @route   GET /api/file/
// @access  Private
const downloadFile = asyncHandler(async (req, res) => {

    try {
        const {exp, file_name, action} = req.query;

        let path;
        if (action === 'ExpDev')
            path = ExpDevFilesPath;
        else if (action === 'ExpChat')
            path = ExpChatFilesPath;

        const exp_path = path + exp + '/';
        if (!fs.existsSync(exp_path)){
            return res.json({error: 'Experiment not exist'});
        }

        const file_path = exp_path + file_name;
        if (!fs.existsSync(file_path)){
            return res.json({error: 'File not exist'});
        }
        // path.join(__dirname, 'temp/export.tar.gz')

        return res.download(file_path, (err)=>{

        })
    }
    catch (err) {
        return res.json({error: 'Error occurs'});
    }
})

// @desc    remove File
// @route   DELETE /api/file/
// @access  Private
const deleteTodoFile = asyncHandler(async (req, res) => {
    const {exp, file_name} = req.params;

    try {
        const exp_path = ExpDevFilesPath + '/' + exp + '/';
        const file_path = exp_path + file_name;

        if (!fs.existsSync(exp_path) || !fs.existsSync(file_path)){
            return res.json({error: 'Files not exist'});
        }

        fs.unlinkSync(file_path);

        let files = [];
        fs.readdirSync(exp_path).forEach(file => {
            files.push(file);
        });

        return res.json({msg: 'File was deleted successfully', files});

    } catch (err) {
        return res.json({error: 'Error occurs'});
    }
});

const deleteFile = asyncHandler(async (req, res) => {
    const {exp, file_name} = req.params;

    try {
        const exp_path = ExpDevFilesPath + '/' + exp + '/';
        const file_path = exp_path + file_name;

        if (!fs.existsSync(exp_path) || !fs.existsSync(file_path)){
            return res.json({error: 'Files not exist'});
        }

        fs.unlinkSync(file_path);

        let files = [];
        fs.readdirSync(exp_path).forEach(file => {
            files.push(file);
        });

        return res.json({msg: 'File was deleted successfully', files});

    } catch (err) {
        return res.json({error: 'Error occurs'});
    }
})


module.exports = {
    uploadFiles,
    downloadFile,
    deleteFile
}
