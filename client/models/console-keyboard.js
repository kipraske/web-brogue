// Because keystrokes are handled with two separate events, the keyboard model helps share data between these events

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


