var config = require('../config');
var _ = require('underscore');
var fs = require('fs');
var Controller = require('./controller-base');
var User = require('../user/user-model');
var allUsers = require('../user/all-users');

// Controller for propigating errors back to the client console for debugging purposes

function AuthController(ws, sharedControllers) {
    this.ws = ws;
    this.currentUserName = "";
    this.currentUserData = {};
    this.error = sharedControllers.error;
    this.brogue = sharedControllers.brogue;
}

AuthController.prototype = new Controller();
_.extend(AuthController.prototype, {
    controllerName: "auth",
    handlerCollection: {
        login: function (data) {
            var self = this;

            if (data.username == null || data.password == null) {
                self.error.send("Invalid authentication data sent: " + data);
            }

            User.findOne({'username': data.username},
            function (err, user) {
                if (err) {
                    self.error.send(JSON.stringify(err));
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

                    allUsers.addUser(data.username);
                    self.currentUserName = data.username;
                    self.currentUserData = allUsers.getUser(data.username);

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
                    self.error.send(JSON.stringify(err));
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
                    fs.mkdir(config.GAME_DATA_DIR + data.username, 0755, function (err) {
                        if (err) {
                            self.error.send(JSON.stringify(err));
                        }

                        newUser.save(function (err) {
                            if (err) {
                                self.error.send(JSON.stringify(err));
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
            this.brogue.handlerCollection.clean.call(this.brogue, null);
        }
    }
});

module.exports = AuthController;
