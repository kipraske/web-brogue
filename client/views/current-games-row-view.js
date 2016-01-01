// View for current games rollup in the lobby

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "dataIO/send-generic",
    "views/view-activation-helpers"
], function ($, _, Backbone, dispatcher, send, activate) {

    var CurrentGamesRowView = Backbone.View.extend({
        tagName: "tr",
        className: "games-row",
        events : {
            "click #observe-game" : "observeGame"
        },
        
        template : _.template($('#current-games-row').html()),

        observeGame: function(event){
            event.preventDefault();

            var userName = $(event.target).data("username");
            
            send("brogue", "observe", {username: userName});
            dispatcher.trigger("observeGame", {username: userName});
            this.goToConsole();
        },

        render: function() {
            this.model.calculateFormattedIdleTime();
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        goToConsole : function() {
            activate.console();
            dispatcher.trigger("showConsole");
        },

    });

    return CurrentGamesRowView;

});



