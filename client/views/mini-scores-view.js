// Embedded high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "views/score-table-cells"
], function ($, _, Backbone, dispatcher, TableCells) {

    const PREVIOUS_DAYS_OF_GAMES_TO_SHOW = 7;

    var HighScoresView = Backbone.View.extend({

        el: '#mini-scores',
        headingTemplate: _.template($('#mini-scores-heading').html()),

        events: {
            "click #mini-scores-user" : "selectUserScores",
            "click #mini-scores-all" : "selectAllScores"
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
                        sortable: false,
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
                        sortable: false,
                        editable: false
                    }, {
                        name: "level",
                        label: "Level",
                        cell: TableCells.levelCell,
                        sortable: false,
                        editable: false
                    }, {
                        name: "seed",
                        label: "Seed",
                        cell: "string",
                        sortable: false,
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

            this.setAllScores();
            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate({ username: this.model.username }));

            $("#mini-scores-grid").append(this.grid.render().$el);
            $("#mini-scores-paginator").append(this.paginator.render().$el);

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

        selectUserScores: function(event) {

            event.preventDefault();

            this.setUserScores();
            this.refresh();
        },

        setUserScores: function() {

            this.model.setUserScoresForPreviousDays(PREVIOUS_DAYS_OF_GAMES_TO_SHOW);
        },

        selectAllScores: function(event) {

            event.preventDefault();

            this.setAllScores();
            this.refresh();
        },

        setAllScores: function() {

            this.model.setAllScoresForPreviousDays(PREVIOUS_DAYS_OF_GAMES_TO_SHOW);
        }
    });

    return HighScoresView;

});

