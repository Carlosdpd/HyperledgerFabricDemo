const fs = require('fs-extra');

module.exports = function(path) {

  const desiredMode = 0o2775;

  fs.ensureDirSync(path, desiredMode);
  // dir has now been created, including the directory it is to be placed in with permission 0o2775

}
