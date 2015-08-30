define([
    "jquery",
    "underscore",
    "backbone",
    "moment"
], function($, _, Backbone, Moment) {

    var HighScoreItemView = Backbone.View.extend({
        tagName: "tr",
        className: "high-score-item-row",
        events : {
        },

        template : _.template($('#high-scores-row').html()),

        formatDate: function(date) {
            return Moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },

        render: function() {
            var gameRecord = {
                username: this.model.get('username'),
                date: this.formatDate(this.model.get('date')),//this.formatDate(this.model.date),
                score: this.model.get('score'),
                description: this.model.get('description')
            };

            this.$el.html(this.template(gameRecord));
            return this;
        }
    });

    return HighScoreItemView;
});
