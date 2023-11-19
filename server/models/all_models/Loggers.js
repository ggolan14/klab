const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoggersGamesSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: 'Error'
    },
    exp: {
        type: String,
        default: 'Error'
    },
    ip: {
        type: String,
        default: 'Error'
    },
    running_name: {
        type: String,
        default: 'Error'
    },
    action: {
        type: String,
        default: 'Error'
    },
    more_params: {
        type: Object,
        default: {}
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    }
    }, {timestamps: true}
);

const LoggersErrorsSchema = new mongoose.Schema({
        user_id: {
            type: String,
            default: 'Error'
        },
        exp: {
            type: String,
            default: 'Error'
        },
        more_params: {
            type: Object,
            default: {}
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {timestamps: true}
);

LoggersGames = mongoose.model('loggers_games', LoggersGamesSchema);
LoggersErrors = mongoose.model('loggers_errors', LoggersErrorsSchema);

module.exports ={
    LoggersErrors,
    LoggersGames
};
