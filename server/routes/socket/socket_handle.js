const verify_token = require('../../middleware/verify_token');
const {getModelPack} = require("../../models/models");
const UserModel = getModelPack('User').User;

const {getConnectionsHandle} = require('../../Struct/users_list')


// const {getConnectionsHandle} = require('./Struct/users_list')

// const returnAction = async (action, data) => {
//
//     switch (action){
//         case 'login':
//             return await userAuthenticate(data);
//         case 'register':
//             return await userRegister(data);
//         default:
//             return {res: {Error: 'Error'}};
//     }
// }
const socketHandle = async (socket, query) => {
    try {
        let connections_handle = getConnectionsHandle();
        socket.on('disconnect', async () => {
            connections_handle.removeSocketFromRooms(socket);
        });
        // console.log('** NEED TO VERIFY TOKEN **');
        let token;
        try {
            token = socket.handshake.auth.token;
        }
        catch (e) {
            token = null;
        }

        let user_id = null, user = null;
        if (token){
            user_id = verify_token(token).id;
            user = await UserModel.findById(user_id).select('-password');
        }

        if (!user){
            // return;
        }


        connections_handle.addNewUserConnection(user_id, socket, user.Experiments);

        if (user.Experiments.length > 0){
            connections_handle.addUserToRooms(user_id, user.Experiments);
        }

        // console.log('user', user.Experiments);
        // console.log('handshake', socket.handshake.auth.token);


        // socket.on('auth', async (action, data, callback) => {
        //     console.log('action', action);
        //     console.log('data', data);
        //     callback({data: 'reslll'});
        // });

    }
    catch (e) {
        // console.log('authHandle ERROR', e);

    }
}

module.exports = socketHandle;
