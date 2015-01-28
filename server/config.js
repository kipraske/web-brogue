var path = require('path');

// TODO - combine the directories into a single object so we can sort this better

var config = {
    CLIENT_DIR : path.normalize(__dirname + "/../client/"),
    BROGUE_PATH : path.normalize(__dirname + "/../brogue/bin/brogue"),
    GAME_DATA_DIR : path.normalize(__dirname + "/../game-data/"),
    //BROGUE_PATH : path.normalize(__dirname + "/tests/mock-brogue-process.js")
    db : {
        url : "mongodb://localhost/brogue"
    },
    LOBBY_UPDATE_INTERVAL : 5000
};

module.exports = config;