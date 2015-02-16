define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/view-activation-helpers",
], function ($, _, Backbone, send, activate) {
    
    var PlayView = Backbone.View.extend({
        el: "#play",
        
        events: {
            "click #start-brogue" : "startBrogue",
            "click #start-brogue-seed" : "startBrogueSeed",
            "click #show-saved-games" : "showSavedGames",
            "click #show-current-games" : "showCurrentGames",
        },
        startBrogue: function(event){
            event.preventDefault();
            
            send("brogue", "start");
            this.goToConsole();
        },
        
        startBrogueSeed: function(event){
            event.preventDefault();
            
            // TODO - show seed form
            console.log("Here is when we show the view")
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
        
        goToConsole : function(){
            activate.console();
        },
        
        goToLobby: function(){
            activate.lobby();
        }
    });
    
    return PlayView;
    
});