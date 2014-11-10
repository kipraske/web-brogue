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
    "dataIO/dispatcher",
    "views/console-view"
], function( $, _, Backbone, dispatcher, Console){
    
    var console = new Console();
    dispatcher.registerHandler(console.setModelData);
    
    $(document).on("unload", function(){
        console.save();
    });
    
    $(document).on("resize"), function(){
        
        //TODO implement a throttled resizing function for our views
        
    };
    
});
