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
            "click #start-brogue-0" : "startBrogue0",
            "click #start-brogue-seed-0" : "startBrogueSeed0",
            "click #start-brogue-1" : "startBrogue1",
            "click #start-brogue-seed-1" : "startBrogueSeed1",
            "click #show-current-games" : "showCurrentGames",
            "click #show-stats" : "showStats",
            "click #show-high-scores" : "showHighScores"
        },
        startBrogue0: function(event) {
            event.preventDefault();
            this.startBrogue(0)
        },
        startBrogue1: function(event) {
            event.preventDefault();
            this.startBrogue(1)
        },
        startBrogue: function(variantIndex){
            send("brogue", "start", {variant: config.variants[variantIndex].code});
            dispatcher.trigger("startGame", { variantIndex: variantIndex });
            this.goToConsole();
        },
        startBrogueSeed0: function(event) {
            event.preventDefault();
            this.startBrogueSeed(0)
        },
        startBrogueSeed1: function(event) {
            event.preventDefault();
            this.startBrogueSeed(1)
        },
        startBrogueSeed: function(variantIndex){
            event.preventDefault();
            dispatcher.trigger("showSeedPopup", variantIndex);
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