// Full high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "config",
    "views/score-table-cells"
], function ($, _, Backbone, dispatcher, config, TableCells) {

    var AllScoresView = Backbone.View.extend({
        el: '#all-scores',
        headingTemplate: _.template($('#all-scores-heading').html()),

        events: {
            "click #all-scores-variant0" : "selectVariant0Scores",
            "click #all-scores-variant1" : "selectVariant1Scores",
            "click #all-scores-variant2" : "selectVariant2Scores",
            "click #all-scores-user" : "selectUserScores",
            "click #all-scores-daily" : "selectDailyScores",
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

            this.setVariantNoScores(0);
            this.refresh();
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
            this.setVariantNoScores(0);
            this.refresh();
        },

        quit: function() {
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

        selectVariant0Scores: function(event) {

            event.preventDefault();

            this.setVariantNoScores(0);
            this.refresh();
        },

        setVariantNoScores: function(variantNo) {
            this.model.setVariantTopScores(config.variants[variantNo].code);
        },

        selectVariant1Scores: function(event) {

            event.preventDefault();

            this.setVariantNoScores(1);
            this.refresh();
        },

        selectVariant2Scores: function(event) {

            event.preventDefault();

            this.setVariantNoScores(2);
            this.refresh();
        }
    });

    return AllScoresView;

});
