// View for popup when someone decides to start a new game while they have another game open in another window somewhere

define([
    "jquery",
    "underscore",
    "backbone",
    "views/popups/popup-view",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, PopupView, send, activate) {

    var DuplicateBrogueView = PopupView.extend({
        
        events : {

        },
        
        template : _.template($('#duplicate-brogue-popup').html()),
        
        initialize : function(){
            _.extend(this.events, PopupView.prototype.events);

        }
   
    });
    
    return DuplicateBrogueView;

});

