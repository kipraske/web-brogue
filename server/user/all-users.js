/* 
 module for collecting information to share about each user
 -- Schema --
 
 username : {
    sessionID : String,
    brogueProcess : Node Child Process
    lobby : Object // information to display in the lobby
 }
 */
var bCrypt = require('bcrypt-nodejs');

var userCount = 0;

module.exports = {
    users : {},
    addUser : function(userName){
        userCount++;
        var hiddenSalt = bCrypt.genSaltSync(8);
        this.users[userName] = {
            sessionID : userCount + bCrypt.hashSync(userName + hiddenSalt, bCrypt.genSaltSync(8)),
            brogueProcess : null,
            lobbyData : {
                idle : 0,
                deepestLevel : 0,
                seed : 0,
                gold : 0,
                cheatMode : false,
                amulet : false
            }
        };
    },
    removeUser : function(userName){
        this.users[userName] = null;
    },
    getUser : function(userName){
        return this.users[userName];
    }
};
