define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    ConsoleKeyboard = Backbone.Model.extend({
        defaults: {
            keyboardMode : "text",
            keyEventFired : false,
            inputEventFired : false,
            inputValidValue : false,
            keyData : {
                keyCode : 0,
                ctrlKey : 0,
                shiftKey : 0
            }
        },
        
        setKeyDataAttribute : function(key, value){
            this.attributes.keyData[key] = value;
        },
        
        getKeyDataAttribute : function(key){
            return this.attributes.keyData[key];
        }
        
        resetEvents : function(){
            this.set({
                keyEventFired : false,
                inputEventFired : false
            })
        }
        
    });
    
    return ConsoleKeyboard;
    
});


