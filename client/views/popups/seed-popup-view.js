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

        },
    
        handleSeedMessage : function(message){
            if (message === "show popup"){
                this.showPopup(message);
                return;
            }
            
            if (message.result === "fail"){
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

