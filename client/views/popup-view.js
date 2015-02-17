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
        
        
        // Seed form Popup functions
        startGameWithSeed : function(event){
            event.preventDefault();        
            var seedValue = $('#seed').val();  
            send("brogue", "start", {
                seed: seedValue
            });
        },
        
        showSeedError : function(message){
            console.log(message);
            
            $('#seed-validation').html(message);
        }
    });

    return PopupView;

});

