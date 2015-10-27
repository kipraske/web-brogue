// Object containing global constants for server program

var path = require('path');

var config = {
    port : {
        HTTP : 8080
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
    },
    auth : {
        secret: 'asecret',
        tokenExpiryTime: 90 * 24 * 60 * 60 * 1000
    }
};

module.exports = config;
