
define([
    "jquery",
    "underscore",
    "backbone",
    "models/console-cell"
], function($, _, Backbone, CellModel) {

    var ConsoleCellView = Backbone.View.extend({
        tagName: "div",
        className: "console-cell",
        
        initialize: function() {
            this.applySize();
        },
        
        render: function() {
            var cellCharacter = String.fromCharCode(this.model.get("char"));
            var rgbForegroundString = "rgb(" +
                    this.model.get("foregroundRed") + "," +
                    this.model.get("foregroundGreen") + "," +
                    this.model.get("foregroundBlue") + ")";
            var rgbBackgroundString = "rgb(" +
                    this.model.get("backgroundRed") + "," +
                    this.model.get("backgroundGreen") + "," +
                    this.model.get("backgroundBlue") + ")";

            this.el.innerHTML = cellCharacter;
            this.el.style.color = rgbForegroundString;
            this.el.style.backgroundColor = rgbBackgroundString;
            return this;
        },
        
        applySize : function(){
            this.el.style.width = this.model.get("widthPercent") + "%";
            this.el.style.height = this.model.get("heightPercent") + "%";
            this.el.style.left = this.model.get("leftPositionPercent") + "%";
            this.el.style.top = this.model.get("topPositionPercent") + "%";
            this.el.style.fontSize = this.model.get("charSizePx") + "px";
            this.el.style.paddingTop = this.model.get("charPaddingPx") + "px";
        }
    });

    return ConsoleCellView;

});
