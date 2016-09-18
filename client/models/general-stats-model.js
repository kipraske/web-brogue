define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var GeneralStatsModel = Backbone.Model.extend({
        url: '/api/stats/general',
        defaults: function() {
            return {
                totalGames: 0,
                totalEasyModeGames: 0,
                totalNormalModeVictories: 0,
                totalNormalModeSuperVictories: 0,
                totalLumenstones: 0,
                totalLevels: 0
            }
        },
        parse: function (data) {
            return data;
        }
    });

    return GeneralStatsModel;

});