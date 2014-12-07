var path = require('path');

var config = {
    CLIENT_DIR : path.normalize(__dirname + "/../client"),
    BROGUE_PATH : path.normalize(__dirname + "/../brogue/brogue.exe")
    //BROGUE_PATH : path.normalize(__dirname + "/tests/mock-brogue-process.js")
};

module.exports = config;