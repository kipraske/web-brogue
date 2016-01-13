define([
    'jquery',
    'underscore',
    'backbone',
    'moment'
], function($, _, Backbone, Moment) {

    var ChatModel = Backbone.Model.extend({

        //defaults needs to be an object to get per-instance properties
        defaults: function() { return {
            chatMessages: [],
            username: null,
            maxMessages: 1000
        }},
        addChatMessage: function(message) {
            this.get("chatMessages").push(message);
        },

        addStatusMessageWithTime: function(message) {
            var fullMessage = "(system" + " " + this.formatDate(new Date()) + "): " + message;
            this.addChatMessage(fullMessage);
        },

        addChatMessageWithThisUserAndTime: function(message) {
            this.addChatMessageWithUserAndTime(this.get("username"), message);
        },

        addChatMessageWithUserAndTime: function(username, message) {
            var fullMessage = "(" + username + " " + this.formatDate(new Date()) + "): " + message;
            this.addChatMessage(fullMessage);
        },

        formatDate: function(date) {
            return Moment(date).format('h:mm');
        },

        setUsername: function(username) {
            this.set("username", username);
        },

        canChat: function () {
            return this.get("username") !== null;
        },

        getMessages: function () {
            return this.get("chatMessages").slice(-this.get("maxMessages"));
        }
    });

    return ChatModel;

});
