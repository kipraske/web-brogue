// View for popup with seed form

define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "dispatcher",
    "views/popups/popup-view",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, config, dispatcher, PopupView, send, activate) {

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
            if (message.result === "fail") {
                // re-rendering the popup in the case we have a conflict with the duplicate process popup
                // only happens if we have a duplicate process AND user decides to put in a bad seed value
                this.showPopup(message.data);
                this.showSeedError(message.data);
            }
            else if (message.result === "success") {
                this.closePopup();
                dispatcher.trigger("startGame");

                activate.console();
                dispatcher.trigger("showConsole");
            }
        },
        
        startGameWithSeed : function(event){
            event.preventDefault();        
            var seedValue = $('#seed').val();  
            send("brogue", "start", {
                seed: seedValue,
                variant: config.variants[0].code
            });
        },

        showSeedPopup: function() {
            this.showPopup("");
            return;
        },
        
        showSeedError : function(message){
            $('#seed-validation').html(message);
        }
    });
    
    return SeedView;

});

