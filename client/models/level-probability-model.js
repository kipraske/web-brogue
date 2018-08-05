define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var LevelProbabilityModel = Backbone.Collection.extend({
        url: '/api/stats/levelProbability',
        parse: function (data) {
            return data;
        },
        setVariantForLevelProbabilityStats: function(variantCode) {
            this.url = '/api/stats/levelProbability?variant=' + variantCode;
        }
    });

    return LevelProbabilityModel;

});