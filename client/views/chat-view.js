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

            $('#lobby-chat-messages').scrollTop(1E10);
        },

        chatMessage: function (message) {

            this.model.addChatMessageWithUserAndTime(message);

            this.render(); //should be unnecessary - need to set up watch
        },
        chatSend: function (event) {

            event.preventDefault();

            if(!this.model.canChat()) {
                return;
            }

            var inputText = $('#lobby-chat-input').val();
            var messageToSend = this.truncateString(inputText, 140);

            send("chat", "message", { channel: "lobby", data: messageToSend });

            this.model.addChatMessageWithUserAndTime(messageToSend);

            this.render();
            $('#lobby-chat-input').focus();
        },
        login : function(username) {
            this.model.setUsername(username);

            this.render();
        },
        logout: function() {
            this.model.setUsername(null);
        },
        truncateString: function (str, length) {
            return str.length > length ? str.substring(0, length - 3) + '...' : str
        }
    });

    return ChatView;

});
