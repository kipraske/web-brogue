var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');

var fs = require('fs');
var path = require('path');

// Controller for displaying saved games for loading

function SavedGamesController(ws) {
    this.controllerName = "savedGames";
    this.ws = ws;
    this.controllers = null;
}

SavedGamesController.prototype = new Controller();
_.extend(SavedGamesController.prototype, {
    controllerName: "savedGames",
    handlerCollection: {
        getBrogueSaves: function (data) {
            var self = this;
            var currentUserName = this.controllers.auth.currentUserName;
            
            if (!currentUserName){
                return;
            }
            
            var userDirectory = path.normalize(config.path.GAME_DATA_DIR + currentUserName + '/');

            fs.readdir(userDirectory, function (err, files) {
                if (err) {
                    self.controllers.error.send(JSON.stringify(err));
                    return;
                }

                var savedGames = [];

                for (var i = 0, numberOfFiles = files.length; i < numberOfFiles; i++) {
                    var fileName = files[i];
                    var brogueSaveRegex = /\.broguesave$/i;

                    if (brogueSaveRegex.test(fileName)) {
                    var filePath =  userDirectory + fileName;
                    var fileStats = fs.statSync(filePath);
                        
                        savedGames.push({
                            fileName : fileName,
                            modified : fileStats.mtime
                        });
                    }
                }            

                self.sendMessage("saved games", savedGames);
                
            });
        }
    }

});

module.exports = SavedGamesController;

