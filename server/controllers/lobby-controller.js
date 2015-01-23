var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');
var allUsers = require('../user/all-users');

// Controller for broadcasting lobby updates to all users who are currently in the lobby

function LobbyController(ws, sharedControllers) {
    this.ws = ws;
    this.error = sharedControllers.error;
}

LobbyController.prototype = new Controller();
_.extend(LobbyController.prototype, {
    controllerName: "lobby"
});

module.exports = LobbyController;
