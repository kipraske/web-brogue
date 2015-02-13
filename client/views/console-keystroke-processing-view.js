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
    
    var KeyProcessor = Backbone.View.extend({
        el : '#console-keyboard',
        model : new ConsoleKeyboardModel(),
        events : {
            'input' : 'inputHandler',
            'keydown' : 'keydownHandler'
        },
        
        // These both will fire but the order is uncertain.  We need the data from both combined. The keyCode will come from the input field except when the character does not define it, then it will come from the keydown event.  The shift and ctrl modifiers always come from the keydown event.
        
        inputHandler : function(event){
            if (this.el.value === ""){
                this.model.set("inputValidValue", false);
            }
            else {
                this.model.set("inputValidValue", true);
                this.model.setKeyDataAttribute("keyCode", this.el.value);
                this.el.value = "";
            }
            
            if (this.model.get("keyEventFired") === true){
                this.sendKey();
                this.model.resetEvents();
            }
            
            this.model.set("inputEventFired", true);
        },
        keydownHandler : function(event){
            var keyCode = event.keyCode;
            
            // Ignore key events for lone modifiers
            if (keyCode === 16 ||       // Shift
                    keyCode === 17 ||   // Ctrl
                    keyCode === 18) {   // Alt
                return;
            }
            
            // TODO - Adjust overlapping codes: 34-40 are the arrows and others on the numkeypad (but this overlaps with & and stuff)
            
            this.model.setKeyDataAttribute("ctrlKey", event.ctrlKey);
            this.model.setKeyDataAttribute("shiftKey", event.shiftKey);
            
            if (!this.model.get("inputValidValue")){
                // this event ran second but we never updated this so update now
                this.model.setKeyDataAttribute("keyCode", keyCode);
            }
            
            if (this.model.get("inputEventFired") === true){
                this.sendKey();
                this.model.resetEvents();
            }
            else {
                // set this anyway then since this event ran first
                this.model.setKeyDataAttribute("keyCode", keyCode);
            }
            
            this.model.set("keyEventFired", true);
        },
        sendKey: function () {
            var keyData = this.model.get("keyData");
            sendKeypressEvent(KEYPRESS_EVENT_CHAR, keyData.keyCode, keyData.keyData, keyData.shiftKey);
        }

    });
});