
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
                this.el.innerHTML = this.model.get("char");
                this.el.style.color = this.model.get("foregroundColor");
                this.el.style.backgroundColor = this.model.get("backgroundColor");
                return this;
            }

	});

	return ConsoleCellView;

    });
