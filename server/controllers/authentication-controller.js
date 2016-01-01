var config = require('../config');
var _ = require('underscore');
var fs = require('fs');
var Controller = require('./controller-base');
var User = require('../user/user-model');
var cleanUp = require("./cleanup-controllers.js");
var sessions = require('client-sessions');
var brogueConstants = require('../brogue/brogue-constants');

// Controller for handling user authentication over the web socket

function AuthController(socket) {
    this.controllerName = "auth";
    this.socket = socket;
    this.controllers = null;
    
    this.currentUserName = null;
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

                var decodedToken = this.decodeSessionToken(data.token);

                if(!decodedToken) {
                    self.sendMessage("auth", {
                        result: "fail",
                        data: "Token not recognised - use username / password login"
                    });
                    return;
                }

                User.findOne({'username': decodedToken.content},
                    function (err, user) {
                        if (err) {
                            self.controllers.error.send(JSON.stringify(err));
                            return;
                        }

                        if (!user) {
                            self.sendMessage("auth", {
                                result: "fail",
                                data: "Saved username not found in database"
                            });
                            return;
                        }

                        var expiryTime = Number(decodedToken.createdAt) + Number(decodedToken.duration);

                        //console.log("expiry: " + expiryTime + " now: " + new Date().getTime());

                        if (expiryTime < new Date().getTime()) {
                            self.sendMessage("auth", {
                                result: "fail",
                                data: "Token has expired"
                            });
                            return;
                        }

                        self.processSuccessfulLogin(decodedToken.content);
                    });
                }
            },

        register: function (data) {
            var self = this;

            if(data.username.trim() === "" || data.password.trim() === "") {
                self.sendMessage("auth", {
                    result: "fail",
                    data: "Sorry, username or password cannot be blank"
                });
                return;
            }

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
                    newUser.sessionId = self.createSessionToken(newUser.username);

                    // each user needs their own directory for the brogue processes to run in
                    // TODO: should not send errors to the client
                    fs.mkdir(config.path.GAME_DATA_DIR + data.username, 0755, function (err) {

                        if (err && err.code != "EEXIST") {
                            self.controllers.error.send(JSON.stringify(err));
                        }

                        fs.mkdir(config.path.GAME_DATA_DIR + data.username + "-" + brogueConstants.paths.RECORDING, 0755, function (err) {

                            if (err && err.code != "EEXIST") {
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
                    });
                }
            });
        },
        logout: function (data) {

            this.controllers.chat.broadcastLogoutMessage();

            this.currentUserName = null;
            this.controllers.brogue.handlerCollection.clean.call(this.controllers.brogue, null);
            this.sendMessage("auth", {
                result: "logout",
                data: ""
            });
        }
    },

    createSessionToken: function (username) {
        var sessionOpts = {
            cookieName: 'mySession', // cookie name dictates the key name added to the request object
            secret: config.auth.secret, // should be a large unguessable string
            duration: config.auth.tokenExpiryTime
        };

        var encodedToken = sessions.util.encode(sessionOpts, username, sessionOpts.duration);

        return encodedToken;
    },

    decodeSessionToken: function (token) {
        var sessionOpts = {
            cookieName: 'mySession', // cookie name dictates the key name added to the request object
            secret: config.auth.secret // should be a large unguessable string
        };

        var decodedToken = sessions.util.decode(sessionOpts, token);

        return decodedToken;
    },
    processSuccessfulLogin: function(username) {
        if (this.currentUserName) {
            this.sendMessage("auth", {
                result: "fail",
                data: "You are already logged in"
            });
            return;
        }

        this.currentUserName = username;

        this.sendMessage("auth", {
            result: "success",
            data: {
                message: "logged-in",
                username: username,
                token: this.createSessionToken(username)
            }
        });

        this.controllers.chat.broadcastLoginMessage();
    }
});

module.exports = AuthController;
