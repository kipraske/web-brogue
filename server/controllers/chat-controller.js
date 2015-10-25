var Controller = require('./controller-base');
var _ = require('underscore');

var LOBBY_NAME = "lobby";

function ChatController(socket) {
    this.controllerName = "chat";
    this.socket = socket;
    this.controllers = null;
    this.roomName = LOBBY_NAME;

    this.socket.join(LOBBY_NAME);
}

ChatController.prototype = new Controller();
_.extend(ChatController.prototype, {
    controllerName: "chat",
    handlerCollection: {
        message: function (data) {

            //Send to all other listeners in the same room
            var broadcastMessage = { type: "chat", data: {
                type: "message",
                channel: data.channel,
                username: this.controllers.auth.currentUserName,
                data: data.data
            }};

            this.socket.to(this.roomName).emit('message', broadcastMessage);
        }
    },
    enterRoom: function(roomName) {
        this.socket.leave(this.roomName);
        this.roomName = roomName;
        this.socket.join(roomName);
    },
    enterLobby: function() {
        this.socket.leave(this.roomName);
        this.roomName = LOBBY_NAME;
        this.socket.join(LOBBY_NAME);
    },
    broadcastLoginMessage: function() {
        this.broadcastUserStatusMessage("logged in.")
    },
    broadcastLogoutMessage: function() {
        this.broadcastUserStatusMessage("logged out.")
    },
    broadcastStartGame: function() {
        this.broadcastUserStatusMessage("started a game.")
    },
    broadcastObserve: function (gameName) {
        this.broadcastUserStatusMessage("is observing " + gameName + ".")
    },
    broadcastUserStatusMessage: function(message) {
        var broadcastMessage = {
            type: "chat", data: {
                type: "status",
                username: this.controllers.auth.currentUserName,
                data: this.controllers.auth.currentUserName + " " + message
            }
        };

        this.socket.broadcast.emit('message', broadcastMessage);
    }
});

module.exports = ChatController;
