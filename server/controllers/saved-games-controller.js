var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');

var fs = require('fs');
var path = require('path');

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
                    return;
                }

                var savedGamesNames = [];

                for (var i = 0, numberOfFiles = files.length; i < numberOfFiles; i++) {
                    var fileName = files[i];
                    var brogueSaveRegex = /\.broguesave$/i;

                    if (brogueSaveRegex.test(fileName)) {
                        savedGamesNames.push(fileName);
                    }
                }

                if (savedGamesNames.length === 0){
                    return;
                }

                var savedGameReturnData = []
                
                for (var i = 0, numberOfSavedGames = savedGamesNames.length; i < numberOfSavedGames; i++){
                    var fileName = savedGamesNames[i];
                    var filePath = path.normalize(config.GAME_DATA_DIR + currentUserName + '/' + fileName)
                    var fileStats = fs.stat(filePath);
                    
                    savedGameReturnData.push({
                        fileName : fileName,
                        modified : fileStats.mtime
                    });
                }

                this.sendMessage("saved games", savedGameReturnData);
                
            });
        }
    }

});

module.exports = SavedGamesController;

