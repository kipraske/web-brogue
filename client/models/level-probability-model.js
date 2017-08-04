define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var LevelProbabilityModel = Backbone.Collection.extend({
        url: '/api/stats/levelProbability',
        parse: function (data) {
            return data;
        }
    });

    return LevelProbabilityModel;

});