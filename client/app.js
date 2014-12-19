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
    "views/console-view"
], function( $, _, Backbone, debugMode, router, ConsoleView){
    
    // TODO : once things don't require so much debugging, conditionally load the runner if the options have it
    debugMode.attachToGlobalScope();
    
    // initialize each view
    var consoleView = new ConsoleView();
    
    // set up routes for the websocket connection
    router.registerHandlers({
        "error" : console.error.bind(console), //'this' must be 'console' when you call console
        "brogue" : consoleView.updateCellModelData
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
