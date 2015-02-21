// Base View for popup modal boxes

define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, send, activate) {

    var overlayEventsBound = false;

    var PopupView = Backbone.View.extend({
        el: '#popup',
        $overlay : $('#popup-overlay'),
        
        events : {
            "click #popup-close" : "closePopup"
        },
        
        template : function(){}, // override in child
        
        render: function (data) {
            this.$el.html(this.template(data));
        },
        
        showPopup : function(message){
            this.render(message);
            this.$el.removeClass("inactive");
            this.$overlay.removeClass("inactive");
        },
        
        closePopup : function(){
            this.$el.addClass('inactive');
            $('#popup-overlay').addClass("inactive");
        },
        
        bindOverlayEvents : function(){
            // need only be bound once for all popup instances
            if (!overlayEventsBound){
                this.$overlay.on("click", $.proxy(this.closePopup, this));
                overlayEventsBound = true;
            }
        }
    });

    return PopupView;

});

