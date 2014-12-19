var _ = require('underscore');
var Controller = require('./controller-base');
var User = require('../user/user-model');

// Controller for propigating errors back to the client console for debugging purposes

function AuthController(ws, user, error, brogueController) {
    this.ws = ws;
    this.user = user;
    this.error = error;
    this.brogue = brogueController;
}

AuthController.prototype = new Controller();
_.extend(AuthController.prototype, {
    controllerName: "auth",
    handlerCollection: {
        login: function (data) {
            var self = this;
            User.findOne({'username': data.username},
            function (err, user) {
                if (err) {
                    self.error.send(JSON.stringify(err));
                    return;
                }
                
                if (!user) {
                    self.error.send("user not found");
                    return;
                }
                
                if (user.isValidPassword(data.password)) {
                    self.user = user;
                    console.log("login success!");
                }
                else {
                    self.error.send("username password does not match");
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
                    self.error.send("user already exists");
                    return;
                } else {
                    var newUser = new User();
                    newUser.username = data.username;
                    newUser.password = newUser.createHash(data.password);
                    newUser.save(function (err) {
                        if (err) {
                            self.error.send(JSON.stringify(err));
                        }
                        console.log('User Registration succesful');
                        // should probably do something then now uh...                        
                    });
                }
            });
        },    
        logout: function (data) {
            this.user = null;
            // todo - kill child process in the brogue controller - if you are not logged in you are not allowed to have a process
        }
    },
    handleIncomingMessage: function (message) {
        this.handlerCollection[message.type].call(this, message.data);
    }
});

module.exports = AuthController;
