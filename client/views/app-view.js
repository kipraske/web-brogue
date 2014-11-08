define([
    "jquery",
    "underscore",
    "backbone",    
    "views/console"
], function( $, _, BackBone, console){

/*
 *  AppView is responsible for the initialization and teardown of the application
 */

var AppView = Backbone.View.extend({

    initialize : function (){
	console.render();
    }

});

return new AppView();

});
