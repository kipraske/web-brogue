define([
    'jquery',
    'underscore',
    'backbone',
    'moment'
], function($, _, Backbone, Moment) {

    var ChatModel = Backbone.Model.extend({

        chatMessages: [],
        username: null,

        addChatMessage: function(message) {
            this.chatMessages.push(message);
        },

        addChatMessageWithUserAndTime: function(message) {
            var fullMessage = "(" + this.username + " " + this.formatDate(new Date()) + "): " + message;
            this.addChatMessage(fullMessage);
        },

        formatDate: function(date) {
            return Moment(date).format('h:mm');
        },

        setUsername: function(username) {
            this.username = username;
        },

        canChat: function () {
            return username !== null;
        }
    });

    return ChatModel;

});
