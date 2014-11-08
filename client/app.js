define([
    "jquery",
    "underscore",
    "backbone",    
    "models/app"
], function( $, _, BackBone){

var AppView = Backbone.View.extend({

    initialize : function (){
	console.log("initialized!");
    }

});

return new AppView();

});
