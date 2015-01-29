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
            var idleSeconds = this.idle;
            var formattedTime = "";
            
            if (this.idle < 120){
                formattedTime = idleSeconds + "s";
            }
            else if (this.idle >= 120 && this.idle < 3600){
                formattedTime = (idleSeconds / 60) + "m";
            }
            else {
                formattedTime = (idleSeconds / 3600) + "h";
            }
            
            this.set({formattedIdle : formattedTime});
        } 
    });

    return CurrentGamesRow;

});

