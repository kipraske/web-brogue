var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');

var fs = require('fs');

// Controller for displaying saved games for loading

function SavedGamesController(ws) {
    this.controllerName = "saved games";
    this.ws = ws;
    this.controllers = null;
}

SavedGamesController.prototype = new Controller();
_.extend(SavedGamesController.prototype, {
    controllerName: "saved games",
    handlerCollection: {
        getBrogueSaves: function (data) {
            var self = this;
            var currentUserName = this.controllers.authentication.currentUserName;

            fs.readdir(config.GAME_DATA_DIR + currentUserName, function (err, files) {
                if (err) {
                    self.controllers.error.send(JSON.stringify(err));
                }

                for (var i = 0, numberOfFiles = files.length; i < numberOfFiles; i++) {
                    var fileName = files[i];
                    var brogueSaveRegex = /\.broguesave$/i;

                    if (brogueSaveRegex.test(fileName)) {

                    }

                }

            });
        }
    }

});

module.exports = SavedGamesController;

