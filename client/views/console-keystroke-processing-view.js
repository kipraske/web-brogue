// Javascript handles keyboard input in an inconvienient way for the purposes of our console.  We need to combine both the input we would get from the key and the key event itself to get all of the information for the brogue game.

define([
    "jquery",
    "underscore",
    "backbone",
], function($, _, Backbone){

    // See BrogueCode/rogue.h for all brogue event definitions
    var KEYPRESS_EVENT_CHAR = 0;
    
    var KeyProcessor = Backbone.View.extend({
        el : '#console-keyboard',
        model : new keyboardModel(),
        events : {
            'input' : 'inputHandler',
            'keydown' : 'keydownHandler'
        },
        inputHandler : function(e){
            
        },
        keydownHandler : function(e){
            
        }
    });
});