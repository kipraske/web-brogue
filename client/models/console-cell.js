define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {

    var ConsoleCellModel = Backbone.Model.extend({
        defaults: {
            char: 48,
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
            topOffsetPercent : 0
        },

        initialize: function() {
           this.calculatePositionAttributes();
        },
        
        calculatePositionAttributes : function(){
            this.set({
                leftPositionPercent : this.get("x") * this.get("widthPercent"),
                topPositionPercent : this.get("y") * this.get("heightPercent") + this.get("topOffsetPercent")
            });
        }
      
    });

    return ConsoleCellModel;

});
