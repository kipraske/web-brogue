// Class tracks communication with all brogue sockets
// Responsible for distributing messages from players and observers

var brogue = require('./brogue-interface');

module.exports = {

    brogueInterface: {},

    getBrogueInterface: function (username, data) {
        if (this.brogueInterface[username]) {
            if(!this.brogueInterface[username].disconnected) {
                return this.brogueInterface[username];
            }
        }

        //If no interface exists, or it is disconnected, start with a new interface

        this.brogueInterface[username] = new brogue(username);
        this.brogueInterface[username].start(data);

        return this.brogueInterface[username];
    }
}


