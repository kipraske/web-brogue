var _ = require('underscore');
var Controller = require('./controller-base');

// Controller for propigating errors back to the client console for debugging purposes

function AuthController(ws, user, brogueController) {
    this.ws = ws;
    this.user = user;
    this.brogue = brogueController;
}

AuthController.prototype = new Controller();
_.extend(AuthController.prototype, {
    controllerName : "auth",
    handlerCollection : {
        "login" : handleLogin,
        "register" : handleRegister,
        "logout" : handleLogout
    },
    
    // handlers
    handleIncomingMessage : function(message){  
        this.handlerCollection[message.type](message);
    },
    
    handleLogin : function(){
        
    },
    
    handleRegister : function(){
        
    },
    
    handleLogout : function(){
        
    }
});

module.exports = AuthController;
