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
            "click #brogue-1-7-4" : "startBrogue"
        },
        startBrogue: function(event){
            event.preventDefault();
            
            send("brogue", "start");
            $("#console").removeClass("inactive");
            $('header').addClass("inactive");
            $("#lobby").addClass("inactive");
        },
        
        goToConsole : function(){
            // TODO - move the above swapping to this function
        },
        
        goToLobby: function(){
            $('header').removeClass("inactive");
            $("#lobby").removeClass("inactive");
            $("#console").addClass("inactive");
        }
    });
    
    return PlayView;
    
});