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
    "dataIO/socket",
    "dataIO/router",
    "views/auth-view",
    "views/play-view",
    "views/header-view",
    "views/current-games-view",
    "views/console-view"
], function( $, _, Backbone, debugMode, socket, router, AuthView, PlayView, HeaderView, CurrentGamesView, ConsoleView){
    
    // TODO : once things don't require so much debugging, conditionally load the runner if the options have it
    debugMode.attachToGlobalScope();
    
    // initialize each view
    var authView = new AuthView();
    var playView = new PlayView();
    var headerView = new HeaderView();
    var currentGamesView = new CurrentGamesView();
    var consoleView = new ConsoleView();
    
    // set up routes for the websocket connection
    router.registerHandlers({
        //Must bind 'this' to the scope of the view so we can use the internal view functions
        "error" : console.error.bind(console),
        "brogue" : consoleView.updateCellModelData.bind(consoleView),
        "lobby" : currentGamesView.updateRowModelData.bind(currentGamesView),
        "quit" : playView.goToLobby.bind(playView),
        "auth" : authView.handleMessage.bind(authView)
    });
    
    // clean up application
    $(window).on("unload", function(){
        socket.close();
    });
    
    // responsive resizing
    var throttledResize = _.debounce(function(){
            consoleView.resize();
        }, 100);
    $(window).resize(throttledResize);
    
});
