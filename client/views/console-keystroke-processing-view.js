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
        
        // keydown event fires before input is fired
        keydownHandler : function(event){            
            var keyCode = event.keyCode;
            var ctrlKey = event.ctrlKey;
            var shiftKey = event.shiftKey;
            
            this.model.set("ctrlKeyHeld", ctrlKey);
            this.model.set("shiftKeyHeld", shiftKey);
            
            // Ignore key events for lone modifiers
            if (keyCode === 16 ||       // Shift
                    keyCode === 17 ||   // Ctrl
                    keyCode === 18) {   // Alt
                return;
            }
            
            var returnCode;

            // Check brogue/rogue.h for key definitions within brogue
            switch (keyCode) {
                case 13: //enter
                    returnCode = 13;
                    break;
                case 27: //esc
                    returnCode = 27;
                    break;
                case 8: // backspace
                    returnCode = 127; // map to DELETE_KEY
                    break;
                case 9: // tab
                    returnCode = 9;
                    break;
                case 46: // delete
                    returnCode = 127;
                    break;
                case 33: //page up (9)
                    returnCode = 117; // map to u
                    break;
                case 34: //page_down (3)
                    returnCode = 110; // map to n
                    break;
                case 35: //end (1)
                    returnCode = 98; // map to b
                    break;
                case 36: //home (7)
                    returnCode = 121; // map to y
                    break;
                case 37: //left-arrow (4)
                    returnCode = 63234;
                    break;
                case 38: //up-arrow(8)
                    returnCode = 63232;
                    break;
                case 39: //right-arrow(6)
                    returnCode = 63235;
                    break;
                case 40: //down-arrow(2)
                    returnCode = 63233;
                    break;
            }
            
            if (returnCode){
                event.preventDefault();
            }
            
            sendKeypressEvent(KEYPRESS_EVENT_CHAR, returnCode, ctrlKey, shiftKey);
        },
        
        // input event fires after keydown is fired
        inputHandler : function(event){
            
            var charCode = this.el.value.charCodeAt(0);
            this.el.value = "";
            
            var ctrlKey = this.model.get("ctrlKeyHeld");
            var shiftKey = this.model.get("shiftKeyHeld");
            
            sendKeypressEvent(KEYPRESS_EVENT_CHAR, charCode, ctrlKey, shiftKey);
            
            this.model.set("ctrlKeyHeld", false);
            this.model.set("shiftKeyHeld", false);
        }
        
    });
    
    return ConsoleKeyProcessor;
});