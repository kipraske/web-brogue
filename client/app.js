// Main entry point in the client side application.  Initializes all main views.

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
    "views/saved-games-view",
    "views/console-view",
    "views/console-keystroke-processing-view",
    "views/popup-view"
], function( $, _, Backbone, debugMode, socket, router, AuthView, PlayView, HeaderView, CurrentGamesView, SavedGamesView, ConsoleView, ConsoleKeyProcessingView, PopupView){
    
    // If you want to enable debug mode, uncomment this function
    // debugMode.attachToGlobalScope();
    
    // initialize each view
    var authView = new AuthView();
    var playView = new PlayView();
    var headerView = new HeaderView();
    var currentGamesView = new CurrentGamesView();
    var savedGamesView = new SavedGamesView();
    var consoleView = new ConsoleView();
    var consoleKeyboardView = new ConsoleKeyProcessingView();
    var popup = new PopupView();
    
    // set up routes for the websocket connection
    router.registerHandlers({
        //Must bind 'this' to the scope of the view so we can use the internal view functions
        "error" : console.error.bind(console),
        "brogue" : consoleView.updateCellModelData.bind(consoleView),
        "lobby" : currentGamesView.updateRowModelData.bind(currentGamesView),
        "saved games" : savedGamesView.updateRowModelData.bind(savedGamesView),
        "quit" : playView.goToLobby.bind(playView),
        "auth" : authView.handleMessage.bind(authView),
        "header" : headerView.setUserData.bind(headerView),
        "popup" : popup.showPopup.bind(popup),
        "seed error" : popup.showSeedError.bind(popup)
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
