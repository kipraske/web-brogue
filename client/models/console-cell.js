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
            widthPx: 1,
            heightPx: 2,
            leftPositionPx: 0,
            topPositionPx: 0,
            topOffsetPx : 0,
            leftOffsetPx: 0
        },

        initialize: function() {
           this.calculatePositionAttributes();
        },
        
        calculatePositionAttributes : function(){
            this.set({
                leftPositionPx : this.get("x") * this.get("widthPx") + this.get("leftOffsetPx"),
                topPositionPx : this.get("y") * this.get("heightPx") + this.get("topOffsetPx")
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
