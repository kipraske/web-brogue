// After logging in this view provides users with a list of options to begin play

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "dataIO/send-generic",
    "dataIO/router",
    "views/view-activation-helpers",
], function ($, _, Backbone, dispatcher, send, router, activate) {
    
    var PlayView = Backbone.View.extend({
        el: "#play",
        
        events: {
            "click #start-brogue" : "startBrogue",
            "click #start-brogue-seed" : "startBrogueSeed",
            "click #show-saved-games" : "showSavedGames",
            "click #show-current-games" : "showCurrentGames",
            "click #show-high-scores" : "showHighScores"
        },
        startBrogue: function(event){
            event.preventDefault();
            
            send("brogue", "start");
            this.goToConsole();
        },
        
        startBrogueSeed: function(event){
            event.preventDefault();
            
            var popupMessage = '{ "type" : "seed", "data" : "show popup" }';
            router.route(popupMessage);
        },
        
        showSavedGames : function(event){
            event.preventDefault();    
            send('savedGames', 'getBrogueSaves');
            activate.savedGames();
        },
        
        showCurrentGames : function(event){
            event.preventDefault();
            activate.currentGames();
        },

        showHighScores: function(event) {
            event.preventDefault();
            activate.highScores();
            dispatcher.trigger("all-scores");
        },
        
        goToConsole : function(){
            activate.console();
        }
        
    });
    
    return PlayView;
    
});