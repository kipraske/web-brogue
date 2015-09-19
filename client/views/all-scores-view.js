// Full high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "views/high-scores-item-view.js"
], function ($, _, Backbone, HighScoreItemView) {

    var AllScoresView = Backbone.View.extend({
        el: '#all-scores-view',
        headingTemplate: _.template($('#all-scores-heading').html()),

        events: {
            "click #user-high-scores" : "selectUserScores",
            "click #daily-high-scores" : "selectDailyScores",
            "click #monthly-high-scores" : "selectMonthlyScores",
            "click #all-scores" : "selectAllScores"
        },

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {

            this.$el.html(this.headingTemplate({ username: this.model.username }));
            var table = $('#all-scores-table');
            $('all-scores-table-heading').siblings().empty();

            this.model.each(function(score) {
                var highScoreView = new HighScoreItemView({ model: score });
                var $tr = highScoreView.render().$el;

                table.append($tr);
            }, this);

            return this;
        },

        refresh: function() {
            this.model.fetch();
        },

        login: function(userName) {
            this.model.setUserName(userName);

            this.render();
        },

        logout: function() {
            this.model.clearUserName();

            this.render();
        },

        quit: function() {
            this.refresh();
        },

        selectAllScores: function(event) {

            event.preventDefault();

            this.model.setAllScores();
            this.refresh();
        },

        selectUserScores: function(event) {

            event.preventDefault();

            this.model.setUserScores();
            this.refresh();
        },

        selectDailyScores: function(event) {

            event.preventDefault();

            console.log("selectDailyScores");
            this.model.setDailyScores();
            this.refresh();
        },

        selectMonthlyScores: function(event) {

            event.preventDefault();

            this.model.setMonthlyScores();
            this.refresh();
        }
    });

    return AllScoresView;

});
