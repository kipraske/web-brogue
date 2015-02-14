// Javascript handles keyboard input in an inconvienient way for the purposes of our console.  This view is to help process data using an input field in HTML.

define([
    "jquery",
    "underscore",
    "backbone",
    "models/console-keyboard",
    "dataIO/send-keypress"
], function($, _, Backbone, ConsoleKeyboardModel, sendKeypressEvent){

    // See BrogueCode/rogue.h for all brogue event definitions
    var KEYPRESS_EVENT_CHAR = 0;
    
    var ConsoleKeyProcessor = Backbone.View.extend({
        el : '#console-keyboard',
        model : new ConsoleKeyboardModel(),
        events : {
            'keydown' : 'keydownHandler',
            'input' : 'inputHandler'
        },
        
        // keydown fires before input is calculated
        keydownHandler : function(event){            
            var keyCode = event.keyCode;
            
            // Ignore key events for lone modifiers
            if (keyCode === 16 ||       // Shift
                    keyCode === 17 ||   // Ctrl
                    keyCode === 18) {   // Alt
                return;
            }
            
            this.model.set("ctrlKeyHeld", event.ctrlKey);
            this.model.set("shiftKeyHeld", event.shiftKey);
        },
        
        // input fires after input is calculated
        inputHandler : function(event){
            
            var charCode = this.el.value.charCodeAt(0);
            this.el.value = "";
            
            var ctrlKey = this.model.get("ctrlKeyHeld");
            var shiftKey = this.model.get("shiftKeyHeld");
            
            sendKeypressEvent(KEYPRESS_EVENT_CHAR, charCode, ctrlKey, shiftKey);
            
            this.model.set("ctrlKeyHeld", false);
            this.model.set("shiftKeyHeld", false);
        },

    });
    
    return ConsoleKeyProcessor;
});