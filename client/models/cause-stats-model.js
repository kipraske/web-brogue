define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var CauseStatsModel = Backbone.Collection.extend({
        url: '/api/stats/levels/monsters?maxCauses=3',
        parse: function (data) {
            return data;
        },
        setVariantForCauseStats: function(variantCode) {
            this.url = '/api/stats/levels/monsters?maxCauses=3&variant=' + variantCode;
        }
    });

    return CauseStatsModel;

});