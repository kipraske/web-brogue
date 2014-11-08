define([
    'jquery',
    'underscore',
    'backbone',
    ], function( $, _, BackBone ){

	var ConsoleCellModel = Backbone.Model.extend({

	    defaults: {
                char : "",
                fColor : "#000000",
                bColor : "#000000",
                x : 0,
                y : 0,
                leftPosition : 0,
                topPosition : 0,
                width : 20,
                height : 20,
                scaleFactor : 1
	    },
            
            initialize : function(){
                this.leftPosition = this.x * this.width;
                this.topPosition = this.y * this.height;
            }

	});

	return ConsoleCellModel;

    });
