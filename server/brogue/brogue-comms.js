// Class tracks communication with all brogue sockets
// Responsible for distributing messages from players and observers

var brogue = require('./brogue-interface');

module.exports = {

    brogueInterface: {},

    getBrogueInterface: function (username, variant, data, mode) {

        //This would allow us to support simultaneously playing 2 variants - but that requires refactoring the user model
        //var gameKey = _.concat(variant, '-', username);
        var gameKey = username;

        if (this.brogueInterface[gameKey]) {
            if(!this.brogueInterface[gameKey].disconnected) {
                return this.brogueInterface[gameKey];
            }
        }

        //If no interface exists, or it is disconnected, start with a new interface

        try {
            this.brogueInterface[gameKey] = new brogue(username, variant);
            this.brogueInterface[gameKey].start(data, mode);
        }
        catch(e) {
            delete this.brogueInterface[gameKey];
            throw e;
        }

        return this.brogueInterface[gameKey];
    }
}


