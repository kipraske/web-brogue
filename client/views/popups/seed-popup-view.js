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
                
                // TODO - there is an odd bug that happens with the duplicate brogue popup
                // If there we want a new seed but there is a duplicate process but we put in bad data into the field we will
                // get the duplicate process popup but we won't see the seed popup... basically we need to re-render the
                // seed popup if we have closed it but we get a bad seed error message.
                
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

