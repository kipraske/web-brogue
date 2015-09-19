
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
            $('#saved-games, #all-scores-view').addClass('inactive');
            $('#current-games, #high-scores').removeClass('inactive');
        },

        highScores : function(){
            $('#saved-games, #current-games, #high-scores').addClass('inactive');
            $('#all-scores-view').removeClass('inactive');
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
            $('#header, #play, #saved-games, #all-scores-view').addClass("inactive");
            $('#lobby, #auth, #current-games, #high-scores').removeClass("inactive");
        }
    }
    
    return activate;
    
});