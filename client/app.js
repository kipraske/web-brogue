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
    
    var console = new Console();
    
    dispatcher.registerHandlers({
        "brogue" : console.setModelData
    });
    
    $(document).on("unload", function(){
        console.save();
    });
    
    $(document).on("resize"), function(){
        
        //TODO implement a throttled resizing function for our views
        
    };
    
});
