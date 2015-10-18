
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
        
        currentGames : function(){
            $('#saved-games, #all-scores').addClass('inactive');
            $('#current-games, #mini-scores, #chat').removeClass('inactive');
        },

        highScores : function(){
            $('#saved-games, #current-games, #mini-scores').addClass('inactive');
            $('#all-scores, #chat').removeClass('inactive');
        },
        
        console : function(){
            $('#header, #lobby').addClass("inactive");
            $("#console, #console-holder, #console-chat").removeClass("inactive").focus();
        },
        
        lobby: function(){
            $('#header, #lobby').removeClass("inactive");
            $("#console-holder, #console, #console-chat").addClass("inactive");
        },
        
        loggedIn: function(){
            $('#auth').addClass("inactive");
            $('#header, #play').removeClass("inactive");
        },
        
        resetAll: function(){
            $('#header, #play, #saved-games, #all-scores').addClass("inactive");
            $('#lobby, #auth, #current-games, #mini-scores').removeClass("inactive");
        }
    }
    
    return activate;
    
});