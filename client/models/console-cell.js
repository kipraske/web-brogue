define([
    'jquery',
    'underscore',
    'backbone',
    ], function( $, _, BackBone ){

	var ConsoleCellModel = Backbone.Model.extend({

	    defaults: {
                char : "",
                foregroundColor : "#000000",
                backgroundColor : "#000000",
                x : 0,
                y : 0,
                leftPosition : 0,
                topPosition : 0,
                width : 20,
                height : 20,
                scaleFactor : 1
	    },
            
            //TODO: this style information should be handled by the view rather than the model here.  Model should just have x,y, and colors
            
            initialize : function(){
                this.leftPosition = this.x * this.width;
                this.topPosition = this.y * this.height;
            }

	});

	return ConsoleCellModel;

    });
