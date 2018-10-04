// View for current games rollup in the lobby

define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "dispatcher",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, config, dispatcher, send, activate) {

    var CurrentGamesRowView = Backbone.View.extend({
        tagName: "tr",
        className: "games-row",
        events : {
            "click #observe-game" : "observeGame"
        },
        
        template : _.template($('#current-games-row').html()),

        observeGame: function(event){
            event.preventDefault();

            send("brogue", "observe", {username: this.model.get("userName"), variant: this.model.get("variant")});
            dispatcher.trigger("observeGame", {username: this.model.get("userName"), variant: this.model.get("variant")});
            this.goToConsole();
        },

        render: function() {
            this.model.calculateFormattedIdleTime();
            this.model.setPrettyVariant();
            this.model.setPrettyScore();
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        goToConsole : function() {
            activate.console();
            dispatcher.trigger("showConsole");
        }

    });

    return CurrentGamesRowView;

});



