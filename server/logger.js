const fs = require('fs');
const {getTimeDate} = require('./utils');

// (function (){
//     /*  ############### Logs Files ################## */
//     const Experiments = ['TryOrGiveUp', 'PointsGame', 'PointsGameSh', 'WordPuzzle', 'CognitiveTask',
//         'CognitiveTask2', 'SP', 'DFE', 'PL_PATTERN', 'MetaSampling', 'RepeatedChoice', 'Errors'];
//     var dir = './logs/';
//
//     if (!fs.existsSync(dir)){
//         fs.mkdirSync(dir);
//     }
//
//     const file_extension = ['.log', '.err'];
//
//     for (let j=0; j<file_extension.length; j++){
//         for (let i=0; i<Experiments.length; i++){
//             let filename = Experiments[i] + file_extension[j];
//             fs.open(dir + filename,'r',function(err, fd){
//                 if (err) {
//                     fs.writeFile(dir + filename, '', function(err) {
//                         if(err) {
//                         }
//                     });
//                 } else {
//                 }
//             });
//         }
//     }
// })();

const logger = ({logs_target, data, sync, logs_extension}) => {

    const time_date = getTimeDate();
    try {
        const LOGS_PATH = 'logs/';
        if (!fs.existsSync(LOGS_PATH)){
            fs.mkdirSync(LOGS_PATH);
        }

        const FileName = LOGS_PATH + logs_target + logs_extension;

        const DataToAppend = time_date.date + ' | ' + time_date.time + ' | ' + data + "\r\n";

        if (sync)
            fs.appendFileSync(FileName, DataToAppend);
        else
            fs.appendFile(FileName, DataToAppend, function (err) {
                if (err) throw err;
            });
    }
    catch (e) {
        const DataToAppend = time_date.date + ' | ' + time_date.time + ' | File Append Error | ' + logs_target + "\r\n";
        fs.appendFileSync('./logs/Errors.err', DataToAppend);
    }


    // let stream = fs.createWriteStream(dir + '/' + logs_target + '.log', {flags:'a'});
    // let time_date = getTimeDate();
    // let raw = time_date.date + ' | ' + time_date.time + ' | ';
    // Object.keys(data).forEach(
    //     act => {
    //         raw = raw + act + ': ' + data[act] + ' | ';
    //     }
    // );
    //
    // stream.write(raw + "\n");
    // stream.end();

};

module.exports = logger;
