// Full high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "views/score-table-cells"
], function ($, _, Backbone, dispatcher, TableCells) {

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
                        name: "prettyDate",
                        label: "Date",
                        cell: "string",
                        sortable: true,
                        editable: false
                    }, {
                        name: "prettyVariant",
                        label: "Version",
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
                        cell: TableCells.levelCell,
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
                    }, {
                        name: "recording",
                        label: "Recording",
                        cell: TableCells.watchGameUriCell,
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

        activate: function() {
            //Model may be in an old-state, so refresh
            this.setAllScores();
        },

        quit: function() {
            this.refresh();
        },

        selectAllScores: function(event) {

            event.preventDefault();
            this.setAllScores();
        },

        setAllScores: function() {

            this.model.setAllTopScores();
            this.refresh();
        },

        selectUserScores: function(event) {

            event.preventDefault();

            this.model.setUserTopScores();
            this.refresh();
        },

        selectDailyScores: function(event) {

            event.preventDefault();

            this.model.setDailyTopScores();
            this.refresh();
        },

        selectMonthlyScores: function(event) {

            event.preventDefault();

            this.model.setMonthlyTopScores();
            this.refresh();
        }
    });

    return AllScoresView;

});
