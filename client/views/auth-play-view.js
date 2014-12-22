define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-mouse",
    "models/auth-play"
], function($, _, Backbone, sendMouseEvent, AuthenticationAndPlayModel) {

    var AuthenticationAndPlayView = Backbone.View.extend({
        el : "#auth-play",
        model : new AuthenticationAndPlayModel(),
        events : {
            "#login-button" : "handleClick",
            "#register-button" : "handleClick",
            "#play" : "handleClick"
        },
        
        templates : {
            login : _.template($('#login').html()),
            register : _.template($('#register').html()),
            play : _.template($('#play').html())
        },
        
        initialize: function() {
            this.render(this.templates.login);
        },
        
        render: function(template) {
            this.$el.html(template(this.model.toJSON()));
        },
        
        handleClick : function(event){
            console.log("clicked bitches");
        }
    });

    return AuthenticationAndPlayView;

});
