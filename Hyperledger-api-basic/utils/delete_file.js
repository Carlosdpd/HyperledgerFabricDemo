const fs = require('fs-extra');

module.exports = function(path) {

  fs.unlinkSync(path);
  // dir has now been created, including the directory it is to be placed in with permission 0o2775


}
