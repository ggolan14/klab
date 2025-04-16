const mongoose = require('mongoose');
const config = require('config');
var db = config.get('mongoURI');

const connectDB = async () => {
  try {
    console.log('MongoDB trying to connect...');
    console.log('Connecting to '+db);

    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');

    return true;
  } catch (err) {
    // console.Error('db Error', err);
    console.error('err.message', err.message);
    // Exit process with failure
    // return false;
    throw err.message;
  }
};

module.exports = connectDB;

// db.createUser({user: "elirand5",pwd: "ed21011985ed", roles : [ { role : "dbAdmin", db : "klab_db"  }, { role : "readWrite", db : "klab_db"  } ]})

// db.createUser({user: "elirand5",pwd: "ed21011985ed", roles : [ { role : "dbAdmin", db : "DGLAB"  }, { role : "readWrite", db : "DGLAB"  } ]})
// db.updateUser( "elirand5", {  roles : [{ role : "userAdminAnyDatabase", db : "DGLAB"  }, { role : "dbAdmin", db : "DGLAB"  }, { role : "readWrite", db : "DGLAB"  } ] })
//
// db.createUser({ user: "elirand5" , pwd: "ed21011985ed", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})

