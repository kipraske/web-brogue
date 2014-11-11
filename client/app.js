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
    "tests/test-runner",
    "dataIO/dispatcher",
    "views/console-view"
], function( $, _, Backbone, testRunner, dispatcher, Console){
    
    // TODO : once things don't require so much debugging, conditionally load the runner if the options have it
    testRunner.attachToGlobalScope();
    
    // initialize each view
    var console = new Console();
    
    // handle all incoming data from the websocket connection
    dispatcher.registerHandlers({
        "brogue" : console.updateCellModelData
    });
    
    // clean up application
    $(document).on("unload", function(){
        console.save();
    });
    
    // responsive resizing
    var throttledResize = _.debounce(function(){
            console.resize();
        }, 100);
    $(window).resize(throttledResize);
    
});
