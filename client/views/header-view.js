// View for the header that appears when logged in.  In the future may also contain things like user options.

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "util",
    "dataIO/send-generic",
    "models/user",
    "views/view-activation-helpers"
], function ($, _, Backbone, dispatcher, util, send, UserModel, activate) {

    var HeaderView = Backbone.View.extend({
        el: "#header",
        userModel: new UserModel(),

        events: {
            "click #logout": "logout",
            "click #headerLobby": "goToLobby"
        },
        
        template: _.template($('#welcome').html()),
        
        initialize: function () {

        },
        
        render: function () {
            this.$el.html(this.template(this.userModel.toJSON()));
        },
        
        login : function(username){
            this.userModel.set({
                username : username
            });

            this.render();
        },
        
        logout: function(e) {
            e.preventDefault();

            util.removeItem('sessionId');

            dispatcher.trigger("logout");

            send("auth", "logout");
        },

        startGame: function() {
            console.log("start game");
            this.userModel.set({
                playing: true,
                observing: false
            });
            this.render();
        },

        leaveGame: function() {
            console.log("leave game");
            this.userModel.set({
                playing: false,
                observing: false
            });
            this.render();
        },

        goToLobby: function() {
            activate.lobby();
            activate.currentGames();
            dispatcher.trigger("leaveGame");

            //Tell the server we are leaving the game
            send("brogue", "leave");
        },

        observeGame: function(data) {
            console.log("observe game" + JSON.stringify(username));
            this.userModel.set({
                playing: false,
                observing: true,
                observingUsername: data.username
            });
            this.render();
        }
        
    });

    return HeaderView;

});


