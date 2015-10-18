var Controller = require('./controller-base');
var _ = require('underscore');

function ChatController(socket) {
    this.controllerName = "chat";
    this.socket = socket;
    this.controllers = null;
}

ChatController.prototype = new Controller();
_.extend(ChatController.prototype, {
    controllerName: "chat",
    handlerCollection: {
        message: function (data) {

            //Send to all other listeners
            var broadcastMessage = { type: "chat", data: {
                type: "message",
                channel: data.channel,
                data: data.data
            }};

            this.socket.broadcast.emit('message', broadcastMessage);
        }
    }
});

module.exports = ChatController;
