require.config({
    paths: {
	jquery : "libs/jquery",
	underscore : "libs/underscore",
	backbone : "libs/backbone"
    }
});

require([
    "jquery",
    "underscore",
    "backbone",
    "tests/debug-mode",
    "dataIO/router",
    "views/auth-view",
    "views/play-view",
    "views/current-games-view",
    "views/console-view"
], function( $, _, Backbone, debugMode, router, AuthView, PlayView, CurrentGamesView, ConsoleView){
    
    // TODO : once things don't require so much debugging, conditionally load the runner if the options have it
    debugMode.attachToGlobalScope();
    
    // initialize each view
    var authView = new AuthView();
    var playView = new PlayView();
    var currentGamesView = new CurrentGamesView();
    var consoleView = new ConsoleView();
    
    // set up routes for the websocket connection
    router.registerHandlers({
        //Must bind 'this' to the scope of the view so we can use the internal view functions
        "error" : console.error.bind(console),
        "brogue" : consoleView.updateCellModelData.bind(consoleView),
        "lobby" : currentGamesView.updateUserData.bind(currentGamesView),
        "quit" : playView.goToLobby.bind(playView),
        "auth" : authView.handleMessage.bind(authView)
    });
    
    // clean up application
    $(document).on("unload", function(){
        consoleView.save();
    });
    
    // responsive resizing
    var throttledResize = _.debounce(function(){
            consoleView.resize();
        }, 100);
    $(window).resize(throttledResize);
    
});
