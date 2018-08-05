define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var LevelStatsModel = Backbone.Collection.extend({
        url: '/api/stats/levels',
        parse: function (data) {
            return data;
        },
        setVariantForLevelStats: function(variantCode) {
            this.url = '/api/stats/levels?variant=' + variantCode;
        }
    });

    return LevelStatsModel;

});