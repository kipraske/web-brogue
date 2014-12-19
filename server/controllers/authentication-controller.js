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
            User.findOne({'username': data.username},
            function (err, user) {
                if (err) {
                    this.error.send(JSON.stringify(err));
                }
                if (!user) {
                    this.error.send("user not found");
                }
                if (user.isValidPassword(data.password)) {
                    this.user = user;
                    console.log("login success!");
                }
                else {
                    this.error.send("username password does not match");
                }
            }
            );
        },
        register: function (data) {
            User.findOne({'username': username}, function (err, user) {
                if (err) {
                    this.error.send(JSON.stringify(err));
                }
                // already exists
                if (user) {
                    this.error.send("user already exists");
                } else {
                    var newUser = new User();
                    newUser.username = data.username;
                    newUser.password = newUser.createHash(data.password);
                    newUser.save(function (err) {
                        if (err) {
                            this.error.send(JSON.stringify(err));
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
        this.handlerCollection[message.type](message.data);
    }
});

module.exports = AuthController;
