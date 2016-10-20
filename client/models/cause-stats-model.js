define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var CauseStatsModel = Backbone.Collection.extend({
        url: '/api/stats/levels/monsters?maxCauses=3',
        parse: function (data) {
            return data;
        }
    });

    return CauseStatsModel;

});