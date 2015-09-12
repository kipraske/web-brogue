// Main entry point in the client side application.  Initializes all main views.

require.config({
    paths: {
        jquery : "libs/jquery",
        underscore : "libs/underscore",
        backbone : "libs/backbone",
        moment: "libs/moment"
    }
});

require([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "tests/debug-mode",
    "dataIO/socket",
    "dataIO/router",
    "models/high-scores",
    "views/view-activation-helpers",
    "views/auth-view",
    "views/play-view",
    "views/header-view",
    "views/current-games-view",
    "views/saved-games-view",
    "views/high-scores-view",
    "views/console-view",
    "views/console-keystroke-processing-view",
    "views/popups/seed-popup-view",
    "views/popups/duplicate-process-popup-view"
], function( $, _, Backbone, dispatcher, debugMode, socket, router, highScoresModel, activate, AuthView, PlayView, HeaderView, CurrentGamesView, SavedGamesView, HighScoresView, ConsoleView, ConsoleKeyProcessingView, SeedPopupView, DuplicateBroguePopupView){
    
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

    var highScoresModel = new highScoresModel();
    highScoresModel.fetch();
    setInterval(function() { highScoresModel.fetch(); }, 5 * 60 * 1000);
    var highScoresView = new HighScoresView({model: highScoresModel});

    // use dispatcher to co-ordinate multi-view actions on routed commands
    dispatcher.on("quit", highScoresView.refresh, highScoresView);
    dispatcher.on("quit", consoleView.exitToLobby, consoleView);
    dispatcher.on("quit", function(obj) { console.log("event: quit, msg: " + obj.msg) } );

    dispatcher.on("login", headerView.setUserData, headerView);
    dispatcher.on("login", highScoresView.setUserName, highScoresView);

    // set up routes for the websocket connection (only)
    router.registerHandlers({
        //Must bind 'this' to the scope of the view so we can use the internal view functions
        "error" : console.error.bind(console),
        "brogue" : consoleView.queueUpdateCellModelData.bind(consoleView),
        "quit" : function() { dispatcher.trigger("quit") },
        "lobby" : currentGamesView.updateRowModelData.bind(currentGamesView),
        "saved games" : savedGamesView.updateRowModelData.bind(savedGamesView),
        "auth" : authView.handleMessage.bind(authView),
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
