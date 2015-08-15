// Class tracks communication with all brogue sockets
// Responsible for distributing messages from players and observers

module.exports = {

    brogueInterface: {},

    getBrogueInterface: function (username) {

        if (this.brogueInterface[username]) {
            return this.brogueInterface[username];
        }

        brogueInterface[username] = new BrogueInterface(username);
        brogueInterface[username].start();

        return brogueInterface[username];
    }
}


