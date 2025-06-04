const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const zlib = require('zlib');
const fs = require('fs');
// const compression = require('compression');

const app = express();
const bodyParser = require('body-parser');
// Connect Database
connectDB();

// app.use(compression());

// Init Middleware
// app.use(express.json({ extended: false }));
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/content/breakfast', require('./routes/api/content/breakfast'));
app.use('/api/logger', require('./routes/api/logger'));


// app.use(bodyParser.json({type: 'application/gzip'}));


// app.post('/inquisit', async (req, res, next) => {
//   let AltName = req.query.AltName;
//   let ScriptPath = req.query.ScriptPath;
//   let AccountName = req.query.AccountName;
//   let GroupID = req.query.GroupID;
//   let SubjectID = req.query.SubjectID;
//   let content_type = req.headers['content-type'];
//
//     let today = new Date();
//
//     const checkDigit = (i) => {
//         if (i < 10) {
//             i = "0" + i;
//         }
//         return i;
//     }
//
//     let cur_time = checkDigit(today.getHours()) + ":" + checkDigit(today.getMinutes()) + ":" + checkDigit(today.getSeconds());
//     let cur_date = checkDigit(today.getDate()) + "-" + checkDigit(today.getMonth()+1) + "-" + today.getFullYear();
//
//     var dir = './inquisit';
//
//     if (!fs.existsSync(dir)){
//         fs.mkdirSync(dir);
//     }
//
//     dir = dir + '/' + SubjectID;
//     if (!fs.existsSync(dir)){
//         fs.mkdirSync(dir);
//     }
//
//     dir = dir + '/' + cur_date;
//     if (!fs.existsSync(dir)){
//         fs.mkdirSync(dir);
//     }
//
//     dir = dir + '/' + cur_time;
//     if (!fs.existsSync(dir)){
//         fs.mkdirSync(dir);
//     }
//
//
//
//     var gunzip = zlib.createGunzip();
//     req.pipe(gunzip);
//
//     let buffer  = [];
//     gunzip.on('data', function (data) {
//         // decompression chunk ready, add it to the buffer
//         // let datastring = data.toString();
//         // let datastring2 = String(data).split('\n');
//         // let datastring2 = data.toString().split('\r\n');
//         // for(let i=0; i<datastring2.length; i++){
//         //     // let rep = String(datastring2[i]).replace(' ',',');
//         //     buffer.push(data.toString());
//         //     // buffer.push(rep);
//         // }
//         buffer.push(data.toString());
//     }).on('end', function () {
//         //response and decompression complete, join the buffer and return
//        // callback(null, JSON.parse(buffer));
//
//         var file = fs.createWriteStream('array.txt');
//         file.on('Error', function(err) { /* Error handling */ });
//         buffer.forEach(function(v) { file.write(v); });
//         file.end();
//
//     }).on('Error', function (e) {
//     });
//     res.send('working...');
// });

if (process.env.NODE_ENV === 'production') {
  // Set static folder

}
app.use(express.static('client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// const PORT = process.env.PORT || 5000;
const PORT = 3000;
// const PORT = 4000;
app.listen(PORT, () => console.log(`DG-LAB Server started on port ${PORT}`));


/*

eprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

 */
