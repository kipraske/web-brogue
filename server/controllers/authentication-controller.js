var config = require('../config');
var _ = require('underscore');
var fs = require('fs');
var Controller = require('./controller-base');
var User = require('../user/user-model');
var allUsers = require('../user/all-users');
var cleanUp = require("./cleanup-controllers.js");

// Controller for handling user authentication over the web socket

function AuthController(ws) {
    this.controllerName = "auth";
    this.ws = ws;
    this.controllers = null;
    
    this.currentUserName = "";
    this.currentUserData = {};
}

AuthController.prototype = new Controller();
_.extend(AuthController.prototype, {
    controllerName: "auth",
    handlerCollection: {
        login: function (data) {
            var self = this;

            if (data.username == null || data.password == null) {
                self.controllers.error.send("Invalid authentication data sent: " + data);
            }

            User.findOne({'username': data.username},
            function (err, user) {
                if (err) {
                    self.controllers.error.send(JSON.stringify(err));
                    return;
                }

                if (!user) {
                    self.sendMessage("auth", {
                        result: "fail",
                        data: "Username and password combination not found"
                    });
                    return;
                }

                if (user.isValidPassword(data.password)) {

                    if (self.currentUserData.sessionID) {
                        self.sendMessage("auth", {
                            result: "fail",
                            data: "You are already logged in"
                        });
                        return;
                    }

                    self.currentUserName = data.username;
                    var existingUserData = allUsers.getUser(data.username);

                    if (existingUserData){
                        self.currentUserData = existingUserData;
                    }
                    else{
                        allUsers.addUser(data.username);
                    }

                    self.sendMessage("auth", {
                        result: "success",
                        data: "logged-in"
                    });
                }
                else {
                    self.sendMessage("auth", {
                        result: "fail",
                        data: "Username and password combination not found"
                    });
                }
            }
            );
        },
        register: function (data) {
            var self = this;
            User.findOne({'username': data.username}, function (err, user) {
                if (err) {
                    self.controllers.error.send(JSON.stringify(err));
                    return;
                }
                // already exists
                if (user) {
                    self.sendMessage("auth", {
                        result: "fail",
                        data: "Sorry that username is already taken"
                    });
                    return;
                }
                else if (data.password !== data.repeat) {
                    self.sendMessage("auth", {
                        result: "fail",
                        data: "Password fields do not match"
                    });
                    return;
                }
                else {
                    var newUser = new User();
                    newUser.username = data.username;
                    newUser.password = newUser.createHash(data.password);

                    // each user needs their own directory for the brogue processes to run in
                    fs.mkdir(config.path.GAME_DATA_DIR + data.username, 0755, function (err) {
                        if (err) {
                            self.controllers.error.send(JSON.stringify(err));
                        }

                        newUser.save(function (err) {
                            if (err) {
                                self.controllers.error.send(JSON.stringify(err));
                            }

                            self.sendMessage("auth", {
                                result: "success",
                                data: "registered"
                            });

                        });
                    });
                }
            });
        },
        logout: function (data) {
            allUsers.removeUser(this.currentUserName);
            this.currentUserName = "";
            this.currentUserData = {};
            this.controllers.brogue.handlerCollection.clean.call(this.controllers.brogue, null);
            this.sendMessage("auth", {
                result : "logout",
                data : ""
            });
        }
    }
});

module.exports = AuthController;
