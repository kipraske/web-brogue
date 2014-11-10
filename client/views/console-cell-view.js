
define([
    "jquery",
    "underscore",
    "backbone",    
    "models/console-cell"
    ], function( $, _, Backbone, CellModel){

	var ConsoleCellView = Backbone.View.extend({
            
            tagName : "div",
            
            className : "console-cell",

	    initialize : function (){
                this.listenTo(this.model, "change", this.render());
                
                this.el.style.width = this.model.get("widthPercent") + "%";
                this.el.style.height = this.model.get("heightPercent") + "%";
                this.el.style.left = this.model.get("leftPositionPercent") + "%";
                this.el.style.top = this.model.get("topPositionPercent") + "%";
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
