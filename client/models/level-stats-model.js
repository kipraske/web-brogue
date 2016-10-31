define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var LevelStatsModel = Backbone.Collection.extend({
        url: '/api/stats/levels',
        parse: function (data) {
            return data;
        }
    });

    return LevelStatsModel;

});