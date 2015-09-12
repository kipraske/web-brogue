// View for login and registration forms

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "dataIO/send-generic",
    "dataIO/router",
    "models/auth",
    "views/view-activation-helpers"
], function ($, _, Backbone, dispatcher, send, router, AuthenticationModel, activate) {

    var AuthenticationView = Backbone.View.extend({
        el: "#auth",
        model: new AuthenticationModel(),

        events: {
            "click #login-button": "loginSubmit",
            "click #register-button": "registerSubmit",
            "click #to-register": "changeToRegister",
            "click #to-login": "changeToLogin",
        },
        templates: {
            login: _.template($('#login').html()),
            register: _.template($('#register').html())
        },
        initialize: function () {

            // TODO - if we are already logged on via cookie than we can render the other one

            this.render("login");
        },
        render: function (templateName) {
            this.$el.html(this.templates[templateName](this.model.toJSON()));
        },
        loginSubmit: function (event) {
            event.preventDefault();
            
            var loginData = {
                username: $('#username').val(),
                password: $('#password').val()
            };
            this.model.set({
                username: loginData.username
            });
            send("auth", "login", loginData);
        },
        registerSubmit: function (event) {
            event.preventDefault();
            
            var registerData = {
                username: $('#username').val(),
                password: $('#password').val(),
                repeat: $('#password-repeat').val()
            };
            send("auth", "register", registerData);
        },
        changeToRegister: function (event) {
            event.preventDefault();
            this.render("register");
        },
        changeToLogin: function (event) {
            event.preventDefault();
            this.render("login");
        },
        handleMessage: function (message) {

            if (message.result === "fail") {
                $('#auth-message')
                        .removeClass()
                        .addClass("error")
                        .html(message.data);
                return;
            }
            
            if (message.result === "logout"){
                this.render("login");
                dispatcher.trigger("logout");
                activate.resetAll();
                return;
            }

            switch (message.data) {
                case "logged-in":
                    activate.loggedIn();
                    dispatcher.trigger("login", this.model.get('username'));

                    break;
                case "registered" :
                    this.render("login");
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
