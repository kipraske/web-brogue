// Object containing global constants for server program

var path = require('path');

var config = {
    port : {
        HTTP : 80,
        WS : 8080
    },
    path : {
        CLIENT_DIR : path.normalize(__dirname + "/../client/"),
        BROGUE : path.normalize(__dirname + "/../brogue/bin/brogue"),
        GAME_DATA_DIR : path.normalize(__dirname + "/../game-data/")
    },
    db : {
        url : "mongodb://localhost/brogue"
    },
    lobby : {
        UPDATE_INTERVAL : 1000,
        TIMEOUT_INTERVAL : 300000
    }
    
};

module.exports = config;