// Model for a list of high scores

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var HighScores = Backbone.Collection.extend({
        url: '/api/games',
        parse: function(data) {
            return data.data;
        }
    });

    return HighScores;

});