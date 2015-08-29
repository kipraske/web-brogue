define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {

    var HighScoreItemView = Backbone.View.extend({
        tagName: "tr",
        className: "high-score-item-row",
        events : {
        },

        template : _.template($('#high-scores-row').html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return HighScoreItemView;
});
