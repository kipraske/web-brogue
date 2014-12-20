var path = require('path');

var config = {
    CLIENT_DIR : path.normalize(__dirname + "/../client/"),
    BROGUE_PATH : path.normalize(__dirname + "/../brogue/brogue.exe"),
    GAME_DATA_DIR : path.normalize(__dirname + "/../game-data/"),
    //BROGUE_PATH : path.normalize(__dirname + "/tests/mock-brogue-process.js")
    db : {
        url : "mongodb://localhost/brogue"
    }
};

module.exports = config;