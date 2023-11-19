const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(token) {
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    return decoded.user;
  } catch (err) {
    return null;
  }

};


