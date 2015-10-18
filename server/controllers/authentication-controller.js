var config = require('../config');
var _ = require('underscore');
var fs = require('fs');
var Controller = require('./controller-base');
var User = require('../user/user-model');
var allUsers = require('../user/all-users');
var cleanUp = require("./cleanup-controllers.js");

// Controller for handling user authentication over the web socket

function AuthController(socket) {
    this.controllerName = "auth";
    this.socket = socket;
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

            if ((data.username == null || data.password == null) && data.token == null) {
                self.controllers.error.send("Invalid authentication data sent: " + data);
            }

            if(data.token == null) {

                //Username / password authentication

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

                            self.processSuccessfulLogin(data.username);
                        }
                        else {
                            self.sendMessage("auth", {
                                result: "fail",
                                data: "Username and password combination not found"
                            });
                        }
                    }
                );
            }
            else {

                //Token-based login

                var decodedToken = allUsers.decodeSessionToken(data.token);

                if(!decodedToken) {
                    self.sendMessage("auth", {
                        result: "fail",
                        data: "Token not recognised - use username / password login"
                    });
                    return;
                }
                else {
                    var expiryTime = Number(decodedToken.createdAt) + Number(decodedToken.duration);

                    //console.log("expiry: " + expiryTime + " now: " + new Date().getTime());

                    if(expiryTime < new Date().getTime()) {
                        self.sendMessage("auth", {
                            result: "fail",
                            data: "Token has expired"
                        });
                        return;
                    }

                    this.processSuccessfulLogin(decodedToken.content);
                }
            }
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
                    newUser.sessionId = allUsers.createSessionToken(newUser.username);

                    // each user needs their own directory for the brogue processes to run in
                    // Failure here is not handled well
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
                                data: {
                                    message: "registered",
                                    token: newUser.sessionId
                                }
                            });
                        });
                    });
                }
            });
        },
        logout: function (data) {

            this.controllers.chat.broadcastLogoutMessage();

            allUsers.removeUser(this.currentUserName);
            this.currentUserName = "";
            this.currentUserData = {};
            this.controllers.brogue.handlerCollection.clean.call(this.controllers.brogue, null);
            this.sendMessage("auth", {
                result: "logout",
                data: ""
            });
        }
    },
    processSuccessfulLogin: function(username) {
        if (this.currentUserData.sessionID) {
            this.sendMessage("auth", {
                result: "fail",
                data: "You are already logged in"
            });
            return;
        }

        this.currentUserName = username;
        var existingUserData = allUsers.getUser(username);

        if (existingUserData) {
            this.currentUserData = existingUserData;
        }
        else {
            allUsers.addUser(username);
        }

        this.sendMessage("auth", {
            result: "success",
            data: {
                message: "logged-in",
                username: username,
                token: allUsers.createSessionToken(username)
            }
        });

        this.controllers.chat.broadcastLoginMessage();
    }
});

module.exports = AuthController;
