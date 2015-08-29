// Model for a list of high scores

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var HighScores = Backbone.Collection.extend({
        url: '/api/games/flend',
        parse: function(data) {
            console.log("Parsing high scores API");
            console.log(JSON.stringify(data.data));
            return data.data;
        }
    });

    return HighScores;

});