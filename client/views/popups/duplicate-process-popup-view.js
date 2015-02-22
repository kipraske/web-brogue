// View for popup when someone decides to start a new game while they have another game open in another window somewhere

define([
    "jquery",
    "underscore",
    "backbone",
    "views/popups/popup-view",
    "models/popups/duplicate-process-popup-data",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, PopupView, DuplicateBrogueModel, send, activate) {

    var DuplicateBrogueView = PopupView.extend({
        model: new DuplicateBrogueModel(),
        
        events : {
            'click #duplicate-brogue-button' : 'submit'
        },
        
        template : _.template($('#duplicate-brogue-popup').html()),
        
        initialize : function(){
            _.extend(this.events, PopupView.prototype.events);
        },
        
        handleMessage : function(message){            
            this.model.set("brogueProcessData", message);
            this.model.calculateActionText();
            this.showPopup({
                action: this.model.get("action")
            });
        },
   
        submit : function(event){
            event.preventDefault();
            var selection = $('input[name="duplicate-brogue-choice"]:checked').val();
            
            if (selection === "mirror"){
                send("brogue", "mirrorDuplicate");
            }
            else if (selection === "reset"){
                send("brogue", "resetDuplicate", this.model.get("brogueProcessData"));
            }
            
            this.closePopup();
        }
   
    });
    
    return DuplicateBrogueView;

});

