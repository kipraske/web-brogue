// View for a single console cell

define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-mouse"
], function($, _, Backbone, sendMouseEvent) {

    // See BrogueCode/rogue.h for all brogue event definitions
    var MOUSE_UP_EVENT_CHAR = 1;
    var MOUSE_DOWN_EVENT_CHAR = 2;
    var RIGHT_MOUSE_DOWN_EVENT_CHAR = 3;
    var RIGHT_MOUSE_UP_EVENT_CHAR = 4;
    var MOUSE_HOVER_EVENT_CHAR = 5;

    var ConsoleCellView = Backbone.View.extend({
        tagName: "div",
        className: "console-cell",
        events : {
            "click" : "handleClick"
        },
        
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
            this.el.style.width = this.model.get("widthPx") + "px";
            this.el.style.height = this.model.get("heightPx") + "px";
            this.el.style.left = this.model.get("leftPositionPx") + "px";
            this.el.style.top = this.model.get("topPositionPx") + "px";
            this.el.style.fontSize = this.model.get("charSizePx") + "px";
            this.el.style.paddingTop = this.model.get("charPaddingPx") + "px";
        },
        
        handleClick : function(event){
            sendMouseEvent(
                MOUSE_DOWN_EVENT_CHAR, 
                this.model.get("x"), 
                this.model.get("y"), 
                event.ctrlKey, 
                event.shiftKey
            );
            sendMouseEvent(
                MOUSE_UP_EVENT_CHAR, 
                this.model.get("x"), 
                this.model.get("y"), 
                event.ctrlKey, 
                event.shiftKey
            );
        }
    });

    return ConsoleCellView;

});
