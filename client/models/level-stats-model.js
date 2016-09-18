define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var LevelStatsModel = Backbone.Collection.extend({
        url: '/api/stats/levels?maxCauses=3',
        parse: function (data) {
            return data;
        }
    });

    return LevelStatsModel;

});