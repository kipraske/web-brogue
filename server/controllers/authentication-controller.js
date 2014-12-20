var _ = require('underscore');
var Controller = require('./controller-base');
var User = require('../user/user-model');
var allUsers = require('../user/all-users');

// Controller for propigating errors back to the client console for debugging purposes

function AuthController(ws, currentUser, error, brogueController) {
    this.ws = ws;
    this.currentUser = currentUser;
    this.error = error;
    this.brogue = brogueController;
}

AuthController.prototype = new Controller();
_.extend(AuthController.prototype, {
    controllerName: "auth",
    handlerCollection: {
        login: function (data) {
            var self = this;
            
            if (data.username == null || data.password == null){
                self.error.send("Invalid authentication data sent: " + data);
            }
            
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
                    
                    console.log(self.currentUser);
                    
                    if (self.currentUser.sessionID){
                        self.error.send("You are already logged in!");
                        return;
                    }
                    
                    allUsers.addUser(data.username);
                    self.currentUser = allUsers.getUser(data.username);
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
            this.currentUser = {};
            // todo - kill child process in the brogue controller - if you are not logged in you are not allowed to have a process
        }
    }
});

module.exports = AuthController;
