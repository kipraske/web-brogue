// View for popup modal boxes

define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, send, activate) {

    var PopupView = Backbone.View.extend({
        el: '#popup',
        
        events : {
            "click #popup-close" : "closePopup",
            "click #seed-button" : "startGameWithSeed"
        },
        
        templates: {
            seed: _.template($('#seed-popup').html())
        },
        
        render: function (templateName, data) {
            this.$el.html(this.templates[templateName](data));
        },
        
        showPopup : function(message){
            this.render(message.popupType, message.data);
            this.$el.removeClass("inactive");
            var $overlay = $('#popup-overlay').removeClass("inactive");
            $overlay.on("click", $.proxy(this.closePopup, this));
        },
        
        closePopup : function(){
            this.$el.addClass('inactive');
            $('#popup-overlay').addClass("inactive");
        },
        
        
        // TODO - these seed functions should probably be their own view - especially if we are going to reuse this popup for other things
        
        // Seed form Popup functions
        handleSeedMessage : function(message){
            if (message.result === "fail"){
                this.showSeedError(message.data);
            }
            else{
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

    return PopupView;

});

