define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    ConsoleKeyboard = Backbone.Model.extend({
        defaults: {
            keyEventFired : false,
            inputEventFired : false,
            keyboardMode : "text"
        },
    });
    
    return ConsoleKeyboard;
    
});


