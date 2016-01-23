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

        anonymousLogin: function(username) {

            this.userModel.set({
                username : username + " (anon)",
                loggedIn: false
            });

            this.render();
        },

        login : function(username){
            this.userModel.set({
                username : username,
                loggedIn: true
            });

            this.render();
        },
        
        logout: function(e) {
            e.preventDefault();

            this.leaveGame();

            util.removeItem('sessionId');

            dispatcher.trigger("logout");

            send("auth", "logout");
        },

        startGame: function() {
            //console.log("start game");
            this.userModel.set({
                playing: true,
                observing: false,
                recording: false,
                showLobby: true
            });
            this.render();
        },

        leaveGame: function() {
            //console.log("leave game");
            this.userModel.set({
                playing: false,
                observing: false,
                recording: false,
                showLobby: false
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
            //console.log("observe game" + JSON.stringify(username));

            if(data.username === this.userModel.get("username")) {
                //Observing ourself is the same as playing
                this.userModel.set({
                    playing: true,
                    observing: false,
                    recording: false,
                    observingUsername: data.username,
                    showLobby: true
                });
            }
            else {
                this.userModel.set({
                    playing: false,
                    observing: true,
                    recording: false,
                    observingUsername: data.username,
                    showLobby: true
                });
            }
            this.render();
        },

        recordingGame: function(data) {

            this.userModel.set({
                playing: false,
                observing: false,
                recording: true,
                recordingId: data.recording,
                showLobby: true
            });
            this.render();
        }
        
    });

    return HeaderView;

});


