var _ = require('underscore');
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
                    
                    if (self.currentUserData.sessionID){
                        self.error.send("You are already logged in!");
                        return;
                    }
                    
                    allUsers.addUser(data.username);
                    self.currentUserName = data.username;
                    self.currentUserData = allUsers.getUser(data.username);
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
            allUsers.removeUser(this.currentUserName);
            this.currentUserName = "";
            this.currentUserData = {};
            this.brogue.handlerCollection.clean.call(this.brogue, null);
        }
    }
});

module.exports = AuthController;
