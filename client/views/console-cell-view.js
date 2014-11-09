
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
                var modelData = this.model.toJSON();
                
                this.el.innerHTML = modelData.char;
                this.el.style.color = modelData.fColor;
                this.el.style.backgroundColor = modelData.bColor;
                return this;
            }

	});

	return ConsoleCellView;

    });
