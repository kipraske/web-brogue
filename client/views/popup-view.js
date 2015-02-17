
// For various popups:
// * The form to enter seeds

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
            
        },
        
        templates: {
            seed: _.template($('#seed-popup').html())
        },
        
        render: function (templateName, data) {
            this.$el.html(this.templates[templateName](data));
        },
        
        showPopup : function(message){
            this.$el.removeClass("inactive");
            this.render(message.popupType, message.data);
        },
        
        closePopup : function(){
            this.$el.addClass('inactive');
        }
    });

    return PopupView;

});

