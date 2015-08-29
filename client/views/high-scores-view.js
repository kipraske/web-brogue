// View for high scores

define([
    "jquery",
    "underscore",
    "backbone",
    "views/high-scores-item-view.js"
], function ($, _, Backbone, HighScoreItemView) {

    var HighScoresView = Backbone.View.extend({
        el: '#high-scores',

        headingTemplate : _.template($('#high-scores-heading').html()),

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
        },

        render: function() {

            this.$el.html(this.headingTemplate);
            var table = $('#high-scores-table');
            $('high-scores-table-heading').siblings().empty();

            this.model.each(function(score) {
                var highScoreView = new HighScoreItemView({ model: score });
                var $tr = highScoreView.render().$el;

                table.append($tr);
            }, this);

            return this;
        }
    });

    return HighScoresView;

});

