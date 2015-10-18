// Main entry point in the client side application.  Initializes all main views.

require.config({
    paths: {
        jquery : "libs/jquery",
        underscore : "libs/underscore",
        backbone : "libs/backbone",
        moment: "libs/moment",
        backbonePaginator: "libs/backbone.paginator",
        backgrid: "libs/backgrid",
        backgridPaginator: "libs/backgrid-paginator",
        io: "libs/socket.io"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: "Backbone"
        },

        'backgrid': {
            deps: ['backbone'],
            exports: "Backgrid"
        },

        'backgridPaginator': {
            deps: ['backbone', 'backgrid'],
            exports: 'Backgrid.Paginator'
        }
    }
});

require([
    "jquery",
    "underscore",
    "backbone",
    "backbonePaginator",
    "backgrid",
    "backgridPaginator",
    "dispatcher",
    "tests/debug-mode",
    "dataIO/socket",
    "dataIO/router",
    "models/high-scores",
    "models/chat",
    "views/view-activation-helpers",
    "views/auth-view",
    "views/chat-view",
    "views/play-view",
    "views/header-view",
    "views/current-games-view",
    "views/saved-games-view",
    "views/mini-scores-view",
    "views/all-scores-view",
    "views/console-view",
    "views/console-keystroke-processing-view",
    "views/popups/seed-popup-view",
    "views/popups/duplicate-process-popup-view"
], function( $, _, Backbone, BackbonePaginator, Backgrid, BackgridPaginator, dispatcher, debugMode, socket, router, HighScoresModel, ChatModel, activate, AuthView, ChatView, PlayView, HeaderView, CurrentGamesView, SavedGamesView, HighScoresView, AllScoresView, ConsoleView, ConsoleKeyProcessingView, SeedPopupView, DuplicateBroguePopupView){
    
    // If you want to enable debug mode, uncomment this function
    debugMode();
    
    // initialize each view
    var authView = new AuthView();
    var playView = new PlayView();
    var headerView = new HeaderView();
    var currentGamesView = new CurrentGamesView();
    var savedGamesView = new SavedGamesView();
    var consoleView = new ConsoleView();
    var chatView = new ChatView({model: new ChatModel()});
    var consoleKeyboardView = new ConsoleKeyProcessingView();
    var popups = {
        seedView : new SeedPopupView(),
        duplicateBrogueView : new DuplicateBroguePopupView()
    };

    var highScoresModel = new HighScoresModel();
    highScoresModel.fetch();
    setInterval(function() { highScoresModel.fetch(); }, 5 * 60 * 1000);
    var highScoresView = new HighScoresView({model: highScoresModel});

    var allScoresModel = new HighScoresModel();
    allScoresModel.fetch();
    setInterval(function() { allScoresModel.fetch(); }, 5 * 60 * 1000);
    var allScoresView = new AllScoresView({model: allScoresModel});

    // use dispatcher to co-ordinate multi-view actions on routed commands
    dispatcher.on("quit", highScoresView.quit, highScoresView);
    dispatcher.on("quit", consoleView.exitToLobby, consoleView);

    dispatcher.on("login", headerView.login, headerView);
    dispatcher.on("login", highScoresView.login, highScoresView);
    dispatcher.on("login", allScoresView.login, allScoresView);
    dispatcher.on("login", chatView.login, chatView);

    dispatcher.on("logout", highScoresView.logout, highScoresView);
    dispatcher.on("logout", allScoresView.logout, allScoresView);
    dispatcher.on("logout", chatView.logout, chatView);

    dispatcher.on("all-scores", allScoresView.activate, allScoresView);

    // set up routes for the messages from the websocket connection (only)
    router.registerHandlers({
        //Must bind 'this' to the scope of the view so we can use the internal view functions
        "error" : console.error.bind(console),
        "brogue" : consoleView.queueUpdateCellModelData.bind(consoleView),
        "quit" : function(data) { dispatcher.trigger("quit", data) },
        "lobby" : currentGamesView.updateRowModelData.bind(currentGamesView),
        "saved games" : savedGamesView.updateRowModelData.bind(savedGamesView),
        "chat": chatView.chatMessage.bind(chatView),
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
