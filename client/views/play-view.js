// After logging in this view provides users with a list of options to begin play

define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "dispatcher",
    "dataIO/send-generic",
    "dataIO/router",
    "views/view-activation-helpers"
], function ($, _, Backbone, config, dispatcher, send, router, activate) {
    
    var PlayView = Backbone.View.extend({
        el: "#play",
        
        events: {
            "click #start-brogue" : "startBrogue",
            "click #start-brogue-seed" : "startBrogueSeed",
            "click #show-saved-games" : "showSavedGames",
            "click #show-current-games" : "showCurrentGames",
            "click #show-stats" : "showStats",
            "click #show-high-scores" : "showHighScores"
        },
        startBrogue: function(event){
            event.preventDefault();
            
            send("brogue", "start", {variant: config.variants[0].code});
            dispatcher.trigger("startGame");
            this.goToConsole();
        },
        
        startBrogueSeed: function(event){
            event.preventDefault();

            dispatcher.trigger("showSeedPopup");
        },

        showCurrentGames : function(event){
            event.preventDefault();
            activate.currentGames();
        },

        showStats : function(event){
            event.preventDefault();
            activate.statistics();
        },

        showHighScores: function(event) {
            event.preventDefault();
            activate.highScores();
            dispatcher.trigger("all-scores");
        },
        
        goToConsole : function(){
            activate.console();
            dispatcher.trigger("showConsole");
        }
        
    });
    
    return PlayView;
    
});