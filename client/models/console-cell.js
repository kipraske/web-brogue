// Model for a single console cell.  Keeps CSS data about where the cell is placed, the foreground, background, and character that is shown.

define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {

    var ConsoleCellModel = Backbone.Model.extend({
        defaults: {
            char: 0,
            foregroundRed: 255,
            foregroundGreen: 255,
            foregroundBlue: 255,
            backgroundRed: 0,
            backgroundGreen: 0,
            backgroundBlue: 0,
            x: 0,
            y: 0,
            charSizePx : 10,
            charPaddingPx : 2,
            widthPercent: 1,
            heightPercent: 2,
            leftPositionPercent: 0,
            topPositionPercent: 0,
            topOffsetPercent : 0,
            leftOffsetPercent: 0
        },

        initialize: function() {
           this.calculatePositionAttributes();
        },
        
        calculatePositionAttributes : function(){
            this.set({
                leftPositionPercent : this.get("x") * this.get("widthPercent") + this.get("leftOffsetPercent"),
                topPositionPercent : this.get("y") * this.get("heightPercent") + this.get("topOffsetPercent")
            });
        },
        
        clear : function(){
            this.set({
                char: 0,
                foregroundRed: 255,
                foregroundGreen: 255,
                foregroundBlue: 255,
                backgroundRed: 0,
                backgroundGreen: 0,
                backgroundBlue: 0
            });
        }
      
    });

    return ConsoleCellModel;

});
