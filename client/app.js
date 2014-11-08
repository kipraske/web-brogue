define([
    "jquery",
    "underscore",
    "backbone",    
    "views/console"
], function( $, _, BackBone, console){

var App = Backbone.View.extend({

    initialize : function (){
	console.render();
    }

});

return new App();

});
