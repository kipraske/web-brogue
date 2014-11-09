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
    "views/console-view",
], function( $, _, Backbone, console){
    
    // Views will initialize themselves when pulled in with require.js
    // We just need to make sure that everything is wrapped up when we leave the page
    
    $(document).on("unload", function(){
        console.save();
    });
    
});
