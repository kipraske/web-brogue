// View for popup with seed form

define([
    "jquery",
    "underscore",
    "backbone",
    "views/popups/popup-view",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, PopupView, send, activate) {

    var SeedView = PopupView.extend({
        
        events : {
            "click #seed-button" : "startGameWithSeed"
        },
        
        template : _.template($('#seed-popup').html()),
        
        initialize : function(){
            _.extend(this.events, PopupView.prototype.events);
            this.bindOverlayEvents();
        },
    
        handleMessage : function(message){
            if (message === "show popup"){
                this.showPopup(message);
                return;
            }
            
            if (message.result === "fail"){
                // re-rendering the popup in the case we have a conflict with the duplicate process popup
                // only happens if we have a duplicate process AND user decides to put in a bad seed value
                this.showPopup(message.data);
                this.showSeedError(message.data);
            }
            else if (message.result === "success") {
                this.closePopup();
                activate.console();
            }
        },
        
        startGameWithSeed : function(event){
            event.preventDefault();        
            var seedValue = $('#seed').val();  
            send("brogue", "start", {
                seed: seedValue
            });
        },
        
        showSeedError : function(message){
            $('#seed-validation').html(message);
        }
    });
    
    return SeedView;

});

