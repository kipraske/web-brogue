var Controller = require('./controller-base');
var _ = require('underscore');

var chatRecordSchema = require('../database/chat-record-model');
var mongoose = require('mongoose');
var chatRecord = mongoose.model('ChatRecord', chatRecordSchema);

var LOBBY_NAME = "lobby";
var CHAT_HISTORY_LENGTH = 2;

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

            //Incoming message from client

            var incomingMessage = data.data;

            if(incomingMessage.trim().length == 0) {
                return
            }

            var messageToSend = this.truncateString(incomingMessage, this.truncateStringLength);

            //Send to all other listeners in the same room
            var broadcastMessage = { type: "chat", data: {
                type: "message",
                channel: data.channel,
                username: this.controllers.auth.getUserOrAnonName(),
                data: messageToSend
            }};

            this.socket.to(this.roomName).emit('message', broadcastMessage);

            if(this.roomName == LOBBY_NAME) {
                this.persistLobbyMessage({ username: broadcastMessage.data.username,
                                           message: messageToSend });
            }
        },
        lobbyHistory: function(data) {

            var self = this;

            //Delete very old chats if above threshold
            chatRecord.count({}, function(err, count) {

                console.log("count of chats: " + count);
                if (count > CHAT_HISTORY_LENGTH * 2) {
                    chatRecord.find({}).sort('-date').skip(CHAT_HISTORY_LENGTH).exec(function (err, chatRecords) {

                        console.log("chats to delete");
                        console.log(JSON.stringify(chatRecords));

                        if (err) {
                            return;
                        }
                        if (chatRecords) {
                            _.each(chatRecords, function (chatRecord) {
                                chatRecord.remove()
                            });
                        }
                    });
                }
            });

            //Send chat history
            chatRecord.find({}).sort('-date').limit(CHAT_HISTORY_LENGTH).exec(function (err, chatRecords) {
                if (err) {
                    self.controllers.error.send(JSON.stringify(err));
                    return;
                }

                if (chatRecords) {
                    var chatsToSend = _.map(chatRecords, function(chatRecord) { return _.pick(chatRecord, "date", "username", "message"); });
                    var chatsToSendOrdered = _.sortBy(chatsToSend, "date");

                    console.log("chat history");
                    console.log(JSON.stringify(chatRecords));

                    console.log("chat to send");
                    console.log(JSON.stringify(chatsToSendOrdered));

                    self.sendMessage("chat", {
                        type: "history",
                        history: chatsToSendOrdered
                    });
                }
            });
        }
    },
    persistLobbyMessage: function(chatMessage) {
        var thisChatRecord = {
            username: chatMessage.username,
            message: chatMessage.message
        };
        console.log("Persisting message; " + chatMessage.message);

        chatRecord.create(thisChatRecord, function (err) {
            console.err("chat save failure:" + err);
        });
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
    broadcastLeaveGame: function() {
        this.broadcastUserStatusMessage("left their game.")
    },
    broadcastStopObserve: function (gameName) {
        this.broadcastUserStatusMessage("stopped observing " + gameName + ".")
    },
    broadcastObserve: function (gameName) {
        this.broadcastUserStatusMessage("is observing " + gameName + ".")
    },
    broadcastUserStatusMessage: function(message) {
        var broadcastMessage = {
            type: "chat", data: {
                type: "status",
                username: this.controllers.auth.getUserOrAnonName(),
                data: this.controllers.auth.getUserOrAnonName() + " " + message
            }
        };

        this.socket.broadcast.emit('message', broadcastMessage);
    },
    truncateString: function (str, length) {
        return str.length > length ? str.substring(0, length - 3) + '...' : str
    }
});

module.exports = ChatController;
