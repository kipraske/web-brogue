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
    "views/view-activation-helpers",
    "views/auth-view",
    "views/play-view",
    "views/header-view",
    "views/current-games-view",
    "views/saved-games-view",
    "views/console-view",
    "views/console-keystroke-processing-view",
    "views/popups/seed-popup-view",
    "views/popups/duplicate-process-popup-view"
], function( $, _, Backbone, debugMode, socket, router, activate, AuthView, PlayView, HeaderView, CurrentGamesView, SavedGamesView, ConsoleView, ConsoleKeyProcessingView, SeedPopupView, DuplicateBroguePopupView){
    
    // If you want to enable debug mode, uncomment this function
    debugMode();
    
    // initialize each view
    var authView = new AuthView();
    var playView = new PlayView();
    var headerView = new HeaderView();
    var currentGamesView = new CurrentGamesView();
    var savedGamesView = new SavedGamesView();
    var consoleView = new ConsoleView();
    var consoleKeyboardView = new ConsoleKeyProcessingView();
    var popups = {
        seedView : new SeedPopupView(),
        duplicateBrogueView : new DuplicateBroguePopupView()
    };
    
    // set up routes for the websocket connection
    router.registerHandlers({
        //Must bind 'this' to the scope of the view so we can use the internal view functions
        "error" : console.error.bind(console),
        "brogue" : consoleView.queueUpdateCellModelData.bind(consoleView),
        "quit" : consoleView.exitToLobby.bind(consoleView),
        "lobby" : currentGamesView.updateRowModelData.bind(currentGamesView),
        "saved games" : savedGamesView.updateRowModelData.bind(savedGamesView),
        "auth" : authView.handleMessage.bind(authView),
        "header" : headerView.setUserData.bind(headerView),
        "seed" : popups.seedView.handleMessage.bind(popups.seedView),
        "duplicate brogue" : popups.duplicateBrogueView.handleMessage.bind(popups.duplicateBrogueView)
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
    
    activate.endLoading();
});
