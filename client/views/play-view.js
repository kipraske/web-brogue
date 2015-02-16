define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "models/auth"
], function ($, _, Backbone, send) {
    
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
            $('#current-games').addClass('inactive');
            $('#saved-games').removeClass('inactive');
        },
        
        showCurrentGames : function(event){
            event.preventDefault();
            $('#saved-games').addClass('inactive');
            $('#current-games').removeClass('inactive');   
        },
        
        goToConsole : function(){
            $('header').addClass("inactive");
            $("#lobby").addClass("inactive");
            $("#console").removeClass("inactive").focus();
        },
        
        goToLobby: function(){
            $('header').removeClass("inactive");
            $("#lobby").removeClass("inactive");
            $("#console").addClass("inactive");
        }
    });
    
    return PlayView;
    
});