// Object containing global constants for server program

var path = require('path');

var config = {
    port : {
        HTTP : 8080
    },
    variants : [ "BROGUEV174", "GBROGUEV1180211", "BROGUEV175" ],
    path : {
        CLIENT_DIR : path.normalize(__dirname + "/../client/"),
        GAME_DATA_DIR : path.normalize(__dirname + "/../game-data/"),
        brogueClient: {
            BROGUEV174 : path.normalize(__dirname + "/../brogue/bin/brogue"),
            GBROGUEV1180211 : path.normalize(__dirname + "/../gbrogue/bin/brogue"),
            BROGUEV175 : path.normalize(__dirname + "/../brogue-1.7.5/bin/brogue"),
        }
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
