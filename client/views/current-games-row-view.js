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
            console.log("new view created")
        },
        
        render: function() {
            this.$el.html("Got this row! " + this.model.get("seed"));
            return this;
        }
        

    });

    return CurrentGamesRowView;

});



