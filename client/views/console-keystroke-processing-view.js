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
            
            switch (keyCode){
                case 13: //enter (\n)
                    returnCode = 13;
                    break;
                case 27: //esc
                    returnCode = 27;
                    break;
                case 33: //page up (9 or u)
                    returnCode = 117;
                    break;
                case 34: //page_down (3 or n)
                    returnCode = 110;
                    break;
                case 35: //end (1 or b)
                    returnCode = 98;
                    break;
                case 36: //home (7 or y)
                    returnCode = 121;
                    break;
                case 37: //left-arrow (4 or h)
                    returnCode = 104;
                    break;
                case 38: //up-arrow(8 or k)
                    returnCode = 107;
                    break;
                case 39: //right-arrow(6 or l)
                    returnCode = 108;
                    break;
                case 40: //down-arrow(2 or j)
                    returnCode = 106;
                    break;
            }

            if (returnCode){
                sendKeypressEvent(KEYPRESS_EVENT_CHAR, returnCode, ctrlKey, shiftKey);
            }

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