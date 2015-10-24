define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "util",
    "models/chat",
    "dataIO/send-generic",
], function ($, _, Backbone, dispatcher, util, ChatModel, send) {

    var ConsoleChatView = Backbone.View.extend({
        el: "#console-chat",
        listElement: "#console-chat-messages",
        model: new ChatModel(),

        events: {
            "click #console-chat-send-button": "chatSend"
        },
        template: _.template($('#console-chat-template').html()),

        initialize: function () {
            this.render()
        },
        render: function () {

            var messagesList = '';

            _.each(this.model.getMessages(), function (elem) {
                messagesList = messagesList.concat('<li>' + elem + '</li>');
            });

            this.$el.html(this.template({messageListItems: messagesList}));

            $('#console-chat-messages').scrollTop(1E10);
        },

        chatMessage: function (message) {

            if(message.type) {
                if(message.type === "message") {
                    this.model.addChatMessageWithUserAndTime(message.username, message.data);
                }
                if(message.type === "status") {
                    this.model.addStatusMessageWithTime(message.data);
                }
            }

            this.render(); //should be unnecessary - need to set up watch
        },
        chatSend: function (event) {

            event.preventDefault();

            var inputText = $('#console-chat-input').val();
            var messageToSend = this.truncateString(inputText, 140);

            send("chat", "message", { channel: "console", data: messageToSend });

            this.model.addChatMessageWithThisUserAndTime(messageToSend);

           this.render();
           $('#console-chat-input').focus();
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

    return ConsoleChatView;

});
