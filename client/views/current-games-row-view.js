define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {

    var CurrentGamesRowView = Backbone.View.extend({
        tagName: "div",
        className: "game-row",
        events : {
        },
        
        initialize: function() {
            this.$currentGamesEl.append(this.$el);
        },
        
        render: function() {
            this.el.html("Got this row! " + this.model.get("seed"));
        }
        

    });

    return CurrentGamesRowView;

});



