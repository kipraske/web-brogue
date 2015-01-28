define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {

    var CurrentGamesRowView = Backbone.View.extend({
        tagName: "tr",
        className: "games-row",
        events : {
        },
        
        template : _.template($('#current-games-row').html()),
        
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
        

    });

    return CurrentGamesRowView;

});



