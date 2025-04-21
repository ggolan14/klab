const mongoose = require('mongoose');
const config = require('config');


const db = process.env.MONGODB_URI || config.get('mongoURI');

const connectDB = async () => {
  try {
    console.log('MongoDB trying to connect...');
    console.log('Connecting to ' + db);

    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err.message;
  }
};

module.exports = connectDB;
