define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "models/auth-play"
], function ($, _, Backbone, send, AuthenticationAndPlayModel) {

    var AuthenticationView = Backbone.View.extend({
        el: "#auth-play",
        model: new AuthenticationAndPlayModel(),
        events: {
            "click #login-button": "loginSubmit",
            "click #register-button": "registerSubmit",
            "click #play": "playBrogue"
        },
        templates: {
            login: _.template($('#login').html()),
            register: _.template($('#register').html()),
            play: _.template($('#play').html())
        },
        initialize: function () {

            // TODO - if we are already logged on via cookie than we can render the other one

            this.render(this.templates.login);
        },
        render: function (template) {
            this.$el.html(template(this.model.toJSON()));
        },
        loginSubmit: function (event) {
            var loginData = {
                username: $('#username').val(),
                password: $('#password').val()
            };
            send("auth", "login", loginData);
        },
        registerSubmit: function (event) {
            var registerData = {
                username: $('#username').val(),
                password: $('#password').val(),
                repeat: $('#repeat-password').val()
            };
            send("auth", "login", registerData);
        },
        playBrogue: function (event) {
            send("brogue", "start");
            
            // TODO - need to switch to active mode and stuff - hrm where to keep that state...
            
            
        },
        handleMessage: function (message) {

            if (message.result === "fail") {
                $('#auth-message')
                        .removeClass()
                        .addClass("error")
                        .html(message.data);
            }

            switch (message.data) {
                case "logged-in" :
                    this.render(this.templates.play);
                    break;
                case "registered" :
                    this.render(this.templates.login);
                    $('#auth-message')
                            .removeClass()
                            .addClass("success")
                            .html("Successfully Registered - Please log in");
                    break;
            }

        }
    });

    return AuthenticationView;

});
