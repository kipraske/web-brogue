define([
    "jquery",
    "underscore",
    "backbone",    
    "views/console-view"
], function( $, _, BackBone, consoleView){

/*
 *  AppView is responsible for the initialization and teardown of the application
 */

var AppView = Backbone.View.extend({

    initialize : function (){
	consoleView.render();
    }

});

$(document).on("unload", function(){
   
   //TODO implement the save functions. 
   
   console.save();     //send messages to the server to SAVE the brogue game
                       //chat - save chatlog
                       //options - save options
});

return new AppView();

});
