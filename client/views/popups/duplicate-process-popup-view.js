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

        },
        
        template : _.template($('#duplicate-brogue-popup').html()),
        
        initialize : function(){
            _.extend(this.events, PopupView.prototype.events);
        },
        
        handleMessage : function(message){
            
            // TODO - probaby should create a model for the action here
            this.model.set("brogueProcessData", message);
            this.model.calculateActionText();
            
            this.showPopup({
                action: this.model.get("action")
            });
            
        }
   
    });
    
    return DuplicateBrogueView;

});

