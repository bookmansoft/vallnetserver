var crypto = require('crypto');

module.exports = {
  md5: (str)=> {
    return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
  },
  sha1: (str)=> {
    return crypto.createHash('sha1').update(str).digest('hex').toUpperCase();
  }
};