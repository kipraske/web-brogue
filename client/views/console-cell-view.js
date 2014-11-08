
define([
    "jquery",
    "underscore",
    "backbone",    
    "models/console-cell"
    ], function( $, _, Backbone, CellModel){

        var _cellModel = new CellModel();

	var ConsoleCellView = Backbone.View.extend({
            
            tagName : "div",
            
            className : "consoleCell",
            
            model : _cellModel,

	    initialize : function (){
                this.listenTo(this.model, "change", this.render());
	    },
            
            render : function(){
                this.$el.html(this.model.char);
                this.el.style.color = this.model.fColor;
                this.el.style.backgroundColor = this.model.bColor;
            }

	});

	return ConsoleCellView;

    });
