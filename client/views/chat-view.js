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
        inputElement: "#lobby-chat-input",
        truncateStringLength: 1024,

        events: {
            "click #lobby-chat-send-button": "chatSend"
        },
        template: _.template($('#lobby-chat-template').html()),

        initialize: function () {
            this.render()
        },
        render: function () {

            var messagesList = '';

            _.each(this.model.getMessages(), function (elem) {
                messagesList = messagesList.concat('<li>' + elem + '</li>');
            });

            var currentInput = $(this.inputElement).val();

            this.$el.html(this.template({messageListItems: messagesList }));

            $(this.inputElement).val(currentInput);
            $(this.listElement).scrollTop(1E10);
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

            if(!this.model.canChat()) {

                this.model.addChatMessage("Please login to chat.");
            }
            else {
                var inputText = $('#lobby-chat-input').val();
                var messageToSend = this.truncateString(inputText, this.truncateStringLength);

                send("chat", "message", { channel: "lobby", data: messageToSend });

                this.model.addChatMessageWithThisUserAndTime(messageToSend);
            }

           this.render();
           $(this.inputElement).val('');
           $(this.inputElement).focus();
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
