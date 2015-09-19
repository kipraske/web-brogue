// Full high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "views/high-scores-item-view.js"
], function ($, _, Backbone, HighScoreItemView) {

    var AllScoresView = Backbone.View.extend({
        el: '#all-scores',
        headingTemplate: _.template($('#all-scores-heading').html()),

        events: {
            "click #all-scores-user" : "selectUserScores",
            "click #all-scores-daily" : "selectDailyScores",
            "click #all-scores-monthly" : "selectMonthlyScores",
            "click #all-scores-all" : "selectAllScores"
        },

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);

            this.grid = new Backgrid.Grid({
                columns: [
                    {
                        name: "username",
                        label: "User name",
                        cell: "string",
                        sortable: false,
                        editable: false
                    }, {
                        name: "date",
                        label: "Date",
                        cell: "string",
                        sortable: true,
                        editable: false
                    }, {
                        name: "score",
                        label: "Score",
                        cell: "integer",
                        sortable: true,
                        editable: false
                    }, {
                        name: "level",
                        label: "Level",
                        cell: "integer",
                        sortable: true,
                        editable: false
                    }, {
                        name: "seed",
                        label: "Seed",
                        cell: "string",
                        sortable: true,
                        editable: false
                    }, {
                        name: "description",
                        label: "Message",
                        cell: "string",
                        sortable: false,
                        editable: false
                    }],

                collection: this.model
            });

            this.paginator = new Backgrid.Extension.Paginator({
                collection: this.model
            });

        },

        render: function() {

            this.$el.html(this.headingTemplate({ username: this.model.username }));

            $("#all-scores-grid").append(this.grid.render().$el);
            $("#all-scores-paginator").append(this.paginator.render().$el);

            /*
            this.$el.html(this.headingTemplate({ username: this.model.username }));
            var table = $('#all-scores-table');
            $('all-scores-table-heading').siblings().empty();

            this.model.each(function(score) {
                var highScoreView = new HighScoreItemView({ model: score });
                var $tr = highScoreView.render().$el;

                table.append($tr);
            }, this);
*/
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
