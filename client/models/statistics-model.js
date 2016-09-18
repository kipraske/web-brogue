define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var StatisticsModel = Backbone.Collection.extend({
        url: '/api/stats/levels?maxCauses=3',
        parse: function (data) {
            return data;
        }
    });

    return StatisticsModel;

});