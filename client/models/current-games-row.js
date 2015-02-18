// Model for single row of the current games view in the lobby

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var CurrentGamesRow = Backbone.Model.extend({
        defaults: {
            userName : "",
            idle : 0,
            formattedIdle : "",
            deepestLevel : 0,
            seed : 0,
            gold : 0,
            easyMode : false
        },
        
        calculateFormattedIdleTime : function(){
            var idleSeconds = this.get("idle");
            var formattedTime = "";
            
            if (idleSeconds < 120){
                formattedTime = idleSeconds + "s";
            }
            else if (idleSeconds >= 120 && idleSeconds < 3600){
                var min = (idleSeconds / 60) | 0;
                formattedTime = min + "m";
            }
            else {
                var hours = (idleSeconds / 3600) | 0;
                formattedTime = hours + "h";
            }
            
            this.set({formattedIdle : formattedTime});
        } 
    });

    return CurrentGamesRow;

});

