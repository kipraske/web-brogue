define([
    'jquery',
    'underscore',
    'backbone',
    'moment'
], function($, _, Backbone, Moment) {

    var GeneralStatsModel = Backbone.Model.extend({
        url: '/api/stats/general',
        defaults: function() {
            return {
                totalGames: 0,
                totalEasyModeGames: 0,
                totalNormalModeVictories: 0,
                totalNormalModeSuperVictories: 0,
                totalLumenstones: 0,
                totalLevels: 0,
                lastVictoryDate: '',
                lastVictoryUser: ''
            }
        },
        parse: function (data) {

            var parsedData = _.pick(data, 'totalGames', 'totalEasyModeGames', 'totalNormalModeVictories', 'totalNormalModeSuperVictories', 'totalLumenstones', 'totalLevels');
            if(data.lastVictory.date !== 'Never') {
                parsedData.lastVictoryDate = Moment(data.lastVictory.date).format('MMMM Do YYYY, h:mm:ss a');
            }
            else {
                parsedData.lastVictoryDate = data.lastVictory.date;
            }

            parsedData.lastVictoryUser = data.lastVictory.username;

            return parsedData;
        },
        setVariantGeneralStats: function(variantCode) {
            this.url = 'api/stats/general?variant=' + variantCode;
        }
    });

    return GeneralStatsModel;

});