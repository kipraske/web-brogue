define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "util",
    "models/chat",
    "dataIO/send-generic",
], function ($, _, Backbone, dispatcher, util, ChatModel, send) {

    var ChatView = Backbone.View.extend({
        el: "#lobby-chat",
        listElement: "#lobby-chat-messages",
        model: new ChatModel(),

        events: {
            "click #lobby-chat-send-button": "chatSend"
        },
        template: _.template($('#lobby-chat-template').html()),

        initialize: function () {
            this.render()
        },
        render: function () {

            var messagesList = '';

            _.each(this.model.chatMessages, function (elem) {
                messagesList = messagesList.concat('<li>' + elem + '</li>');
            });

            this.$el.html(this.template({messageListItems: messagesList}));
        },

        chatMessage: function (message) {

            this.model.chatMessages.push(message.data);
            this.render(); //should be unnecessary
        },
        chatSend: function (event) {

            event.preventDefault();

            var inputText = $('#lobby-chat-input').val();
            var messageToSend = this.truncateString(inputText, 140);

            send("chat", "message", { channel: "lobby", data: messageToSend });

            this.model.chatMessages.push(messageToSend);

            this.render();
        },
        truncateString: function (str, length) {
            return str.length > length ? str.substring(0, length - 3) + '...' : str
        }
    });

    return ChatView;

});
