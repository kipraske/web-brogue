define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var ChatModel = Backbone.Model.extend({

        chatMessages: []
    });

    return ChatModel;

});
