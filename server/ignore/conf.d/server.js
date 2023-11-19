const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
// Connect Database
connectDB();

// Init Middleware
// app.use(express.json({ extended: false }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(function (req, res, next) {
  // console.log('req.headers[\'x-real-ip\'] -->', req.headers['x-real-ip']);
  next();
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/logger', require('./routes/api/logger'));
app.use('/api/game_settings', require('./routes/api/game_settings'));
app.use('/api/content/try_or_give_up', require('./routes/api/content/try_or_give_up'));
app.use('/api/content/word_puzzle', require('./routes/api/content/word_puzzle'));
app.use('/api/content/only_word_puzzle', require('./routes/api/content/only_word_puzzle'));
app.use('/api/content/only_word_puzzle_yuval', require('./routes/api/content/only_word_puzzle_yuval'));
app.use('/api/content/points_game', require('./routes/api/content/points_game'));
app.use('/api/content/points_game_sh', require('./routes/api/content/points_game_sh'));
app.use('/api/content/cognitive_task', require('./routes/api/content/cognitive_task'));
app.use('/api/content/cognitive_task2', require('./routes/api/content/cognitive_task2'));
app.use('/api/content/colored_matrices', require('./routes/api/content/colored_matrices'));
app.use('/api/content/sp', require('./routes/api/content/sp'));
app.use('/api/content/dfe', require('./routes/api/content/dfe'));
app.use('/api/content/pl_pattern', require('./routes/api/content/pl_pattern'));
app.use('/api/content/repeated_choice', require('./routes/api/content/repeated_choice'));
app.use('/api/content/repeated_choice2a', require('./routes/api/content/repeated_choice2a'));
app.use('/api/content/repeated_choice2b', require('./routes/api/content/repeated_choice2b'));
app.use('/api/content/repeated_choice2c', require('./routes/api/content/repeated_choice2c'));
app.use('/api/content/meta_sampling', require('./routes/api/content/meta_sampling'));

// app.use(bodyParser);

// app.use(bodyParser.json());
//
// app.use(bodyParser.urlencoded({
//     extended: true
// }));


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined) {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// const PORT = process.env.PORT || 5000;
const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
