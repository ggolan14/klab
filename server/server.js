const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const fileupload = require("express-fileupload");
const cors = require('cors');
const bodyParser = require('body-parser');

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

const connectDB = require('./config/db');
const {UsersSeeder} = require('./models/models');
const {Seeder} = require('./models/models');
const socketHandle = require('./routes/socket/socket_handle');
const { setConnectionsHandle } = require('./Struct/users_list');

// חיבור למסד נתונים
connectDB().then(() => {
  try {
    //UsersSeeder().then(res => console.log('Seeder', res));
    //Seeder().then(res => console.log('Seeder', res));
    init_app();
  } catch (e) {
    console.log('connectDB error', e);
    process.exit(1);
  }
});

// הגדרת socket
setConnectionsHandle(io);
io.on('connection', socketHandle);

// Middleware
app.use(cors());
app.use(fileupload());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/h', require('./routes/api/hello'));
app.use('/api/logger', require('./routes/api/logger'));
app.use('/api/exps_actions', require('./routes/api/exps_actions'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Static files (uploads + images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public')));

// Static React build
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

// React routing (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// הפעלת השרת
function init_app() {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}
