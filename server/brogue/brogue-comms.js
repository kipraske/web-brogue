// Class tracks communication with all brogue sockets
// Responsible for distributing messages from players and observers

var brogue = require('./brogue-interface');

module.exports = {

    brogueInterface: {},

    getBrogueInterface: function (username) {

        if (this.brogueInterface[username]) {
            return this.brogueInterface[username];
        }

        this.brogueInterface[username] = new brogue(username);
        this.brogueInterface[username].start();

        return this.brogueInterface[username];
    }
}


