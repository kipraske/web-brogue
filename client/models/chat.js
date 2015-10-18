define([
    'jquery',
    'underscore',
    'backbone',
    'moment'
], function($, _, Backbone, Moment) {

    var ChatModel = Backbone.Model.extend({

        chatMessages: [],
        username: null,
        maxMessages: 100,

        addChatMessage: function(message) {
            this.chatMessages.push(message);
        },

        addStatusMessageWithTime: function(message) {
            var fullMessage = "(system" + " " + this.formatDate(new Date()) + "): " + message;
            this.addChatMessage(fullMessage);
        },

        addChatMessageWithThisUserAndTime: function(message) {
            this.addChatMessageWithUserAndTime(this.username, message);
        },

        addChatMessageWithUserAndTime: function(username, message) {
            var fullMessage = "(" + username + " " + this.formatDate(new Date()) + "): " + message;
            this.addChatMessage(fullMessage);
        },

        formatDate: function(date) {
            return Moment(date).format('h:mm');
        },

        setUsername: function(username) {
            this.username = username;
        },

        canChat: function () {
            return this.username !== null;
        },

        getMessages: function () {
            return this.chatMessages.slice(-this.maxMessages);
        }
    });

    return ChatModel;

});
