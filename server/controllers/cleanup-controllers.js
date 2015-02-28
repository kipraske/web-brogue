
// When the websocket closes we want to make sure that we clean up each controller so they doesn't continue to run processes after the client closes
var allUsers = require('../user/all-users');
var brogueState = require('../enum/brogue-state');

module.exports = function(controllers){
    
    var currentUser = controllers.auth.currentUserName;
    
    if (allUsers.users[currentUser]){
        allUsers.users[currentUser].brogueState = brogueState.INACTIVE;
    }
    
    // again we need 'this' to be in the context of the controller not this function so bind it
    controllers.brogue.handlerCollection.clean.call(controllers.brogue);
    controllers.lobby.stopUserDataListen();
};