// View for popup when someone decides to start a new game while they have another game open in another window somewhere

define([
    "jquery",
    "underscore",
    "backbone",
    "views/popups/popup-view",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, PopupView, send, activate) {

    var DuplicateBrogueView = PopupView.extend({
        events : {
            'click #duplicate-brogue-button' : 'submit'
        },
        
        template : _.template($('#duplicate-brogue-popup').html()),
        
        initialize : function(){
            _.extend(this.events, PopupView.prototype.events);
        },
        
        handleMessage : function(message){            
            this.showPopup(message);
        },
   
        submit : function(event){
            event.preventDefault();
            var selection = $('input[name="duplicate-brogue-choice"]:checked').val();
            
            if (selection === "mirror"){
                send("brogue", "mirrorDuplicate");
                activate.console();
            }
            else if (selection === "kill"){
                send("brogue", "killDuplicate");
                activate.lobby();
            }
            
            this.closePopup();
        }
   
    });
    
    return DuplicateBrogueView;

});

