
// Define our repeatable jquery activation and deactivation functions for our common view actions.

define(['jquery'], function($){
    
    var activate = {
        endLoading : function(){
            $('#about').removeClass('inactive');
            $('#loading').addClass('inactive');
        },
        savedGames : function(){       
            $('#current-games').addClass('inactive');
            $('#saved-games').removeClass('inactive');
        },
        
        currentGames : function(event){
            $('#saved-games').addClass('inactive');
            $('#current-games').removeClass('inactive');   
        },
        
        console : function(){
            $('#header, #lobby').addClass("inactive");
            $("#console").removeClass("inactive").focus();
        },
        
        lobby: function(){
            $('#header, #lobby').removeClass("inactive");
            $("#console").addClass("inactive");
        },
        
        loggedIn: function(){
            $('#auth').addClass("inactive");
            $('#header, #play').removeClass("inactive");
        },
        
        resetAll: function(){
            $('#header, #play, #saved-games').addClass("inactive");
            $('#lobby, #auth, #current-games').removeClass("inactive");
        }
    }
    
    return activate;
    
});