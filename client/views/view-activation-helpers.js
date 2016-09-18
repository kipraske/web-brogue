
// Define our repeatable jquery activation and deactivation functions for our common view actions.

define(['jquery'], function($){
    
    var activate = {
        endLoading : function(){
            $('#about').removeClass('inactive');
            $('#loading').addClass('inactive');
        },

        currentGames : function(){
            $('#all-scores, #server-statistics').addClass('inactive');
            $('#current-games, #mini-scores, #chat, #site-news').removeClass('inactive');
        },

        statistics : function(){
            $('#saved-games, #current-games, #mini-scores, #all-scores, #site-news').addClass('inactive');
            $('#server-statistics').removeClass('inactive');
        },

        highScores : function(){
            $('#saved-games, #current-games, #mini-scores, #server-statistics, #site-news').addClass('inactive');
            $('#all-scores, #chat').removeClass('inactive');
        },
        
        console : function(){
            $('#lobby').addClass("inactive");
            $("#console-holder").removeClass("inactive");
            $("#console").focus();
        },
        
        lobby: function(){
            $('#lobby').removeClass("inactive");
            $("#console-holder").addClass("inactive");
        },
        
        loggedIn: function(){
            $('#auth').addClass("inactive");
            $('#play').removeClass("inactive");
        },
        
        resetAll: function(){
            $('#play, #saved-games, #all-scores, #console-holder, #server-statistics').addClass("inactive");
            $('#lobby, #auth, #current-games, #mini-scores').removeClass("inactive");
        }
    };
    
    return activate;
    
});