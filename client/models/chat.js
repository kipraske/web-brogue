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
            this.addChatMessage(this.formatSystemMessage(new Date(), message));
        },

        addChatMessageWithThisUserAndTime: function(message) {
            this.addChatMessageWithUserAndTime(this.get("username"), message);
        },

        addChatMessageWithUserAndTime: function(username, message) {
            this.addChatMessage(this.formatChatMessage(username, new Date(), message));
        },
        addChatHistory: function(history) {
            _.each(history, function(historyEntry) {
                this.addChatMessage(this.formatChatMessage(historyEntry.username, historyEntry.date, historyEntry.message));
            }, this);
        },
        formatSystemMessage: function(date, message) {
            return "[" + this.formatDate(new Date()) + " " + message + "]";
        },
        formatChatMessage: function(username, date, message) {
            return "(" + this.formatDate(date) + ") " + username + ": " + message;
        },
        formatDate: function(date) {

            var formattedDate = [];
            var startOfToday = Moment().startOf('day');

            if(Moment(date).isBefore(startOfToday)) {
                formattedDate =  Moment(date).format('D/MMM ')
            }

            formattedDate += Moment(date).format('HH:mm');
            return formattedDate;
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
