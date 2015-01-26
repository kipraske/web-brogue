define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var CurrentGamesRow = Backbone.Model.extend({
        defaults: {
            idle : 0,
            deepestLevel : 0,
            seed : 0,
            gold : 0,
            easyMode : false
        }
    });

    return CurrentGamesRow;

});

