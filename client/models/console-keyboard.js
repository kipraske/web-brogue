define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    ConsoleKeyboard = Backbone.Model.extend({
        defaults: {
            keyboardMode : "text",
            ctrlKeyHeld : false,
            shiftKeyHeld : false
        } 
    });
    
    return ConsoleKeyboard;
    
});


