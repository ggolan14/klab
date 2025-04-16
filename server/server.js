const express = require('express');
const app = express();

//////////
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
//////////
const connectDB = require('./config/db');
const path = require('path');
const fileupload = require("express-fileupload");
const cors = require('cors');
// const {Seeder, PuzzleSeeder, addNewExperiment} = require('./models/models');
const {Seeder} = require('./models/models');
const {UsersSeeder} = require('./models/models');
const bodyParser = require('body-parser');
// const zip = require('express-easy-zip');
const socketHandle = require('./routes/socket/socket_handle');

const {setConnectionsHandle} = require('./Struct/users_list');

setConnectionsHandle(io);

app.use(cors());
app.use(fileupload());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/api/h', require('./routes/api/hello'));
app.use('/api/logger', require('./routes/api/logger'));
app.use('/api/exps_actions', require('./routes/api/exps_actions'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

io.on('connection', socketHandle);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static('client/build'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public')));
// app.use(express.static('../uploads'));
app.use(express.static(path.resolve( __dirname, '../client', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve( __dirname, '../client', 'build', 'index.html'));
    // res.sendFile(path.resolve( __dirname, 'client', 'build', 'index.html'));
});
// app.use(express.static(path.resolve( __dirname, 'client', 'build')));
//
// // app.use(express.static('client/build'));
//
// app.get('*', (req, res) => {
//
//     res.sendFile(path.resolve( __dirname, 'client', 'build', 'index.html'));
// });


const init_app = () => {
    // app.use(zip());

// Define Routes

// const PORT = 3000;
    const PORT = 4000;

    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
// Connect Database
connectDB().then(
    res => {
      try {
          // addNewExperiment('SignatureTimingEffect').then(res => console.log('addNewExperiment', res));

        //  Seeder().then(res => console.log('Seeder', res));
         // UsersSeeder().then(res => console.log('Seeder', res));
          // fixExp().then(()=>{});

          init_app();

      }
      catch (e) {
        console.log('connectDB Error', e);
          process.exit(1);
      }
    }
);

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// const { exec } = require('child_process');
//
// exec('cd .. && cd client && npm run build', (err) => {
// });
//
// setInterval(() => {
//
//     exec('cd .. && cd client && npm run build', (err) => {
//     });
// }, 60000);
//
// try {
//     const ppp = require('./kkkk');
// }
// catch (e) {
//
// }



// const {getModelPack, defaultVersions} = require('./models/models');
// const fs = require("fs");
// async function fixExp() {
//
//     const exp = 'MetaSampling';
//     const dirs = {
//         expDev: 'expDev',
//         logs: 'logs'
//     };
//
//     let Model = getModelPack(exp).records;
//     let newModel = new Model({o:'o'});
//     await newModel.save();
//     await Model.deleteMany();
//
//     Model = getModelPack(exp).versions;
//     await Model.deleteMany();
//
//     newModel = new Model(defaultVersions[exp]);
//     await newModel.save();
//
//     if (!fs.existsSync(dirs.expDev + '/' + exp)){
//         fs.mkdirSync(dirs.expDev + '/' + exp);
//     }
//     return true;
// }


