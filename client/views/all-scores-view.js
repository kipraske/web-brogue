// Full high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "dataIO/send-generic",
    "views/view-activation-helpers",
    "moment"
], function ($, _, Backbone, dispatcher, send, activate, Moment) {

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

            var self = this;

            var WatchGameUriCell = Backgrid.UriCell.extend({

                events : {
                    "click #watch-game" : "watchGame"
                },

                watchGame: function(event){
                    event.preventDefault();

                    var gameId = $(event.target).data("gameid");
                    var gameDescription = $(event.target).data("gamedescription");

                    send("brogue", "recording", {recording: gameId});
                    dispatcher.trigger("recordingGame", {recording: gameDescription});
                    self.goToConsole();
                },

                render: function () {
                    this.$el.empty();
                    var rawValue = this.model.get(this.column.get("name"));
                    var formattedValue = this.formatter.fromRaw(rawValue, this.model);
                    this.$el.append($("<a>", {
                        href: '#brogue',
                        title: this.model.title,
                        id: 'watch-game',
                        "data-gameid": formattedValue,
                        "data-gamedescription": this.model.get("username") + "-" + this.model.get("seed") + "-" + self.formatDate(this.model.get("date"))
                    }).text("Watch game"));
                    this.delegateEvents();
                    return this;
                }
            });

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
                    }, {
                        name: "recording",
                        label: "Recording",
                        cell: WatchGameUriCell,
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
        },

        goToConsole : function(){
            activate.console();
            dispatcher.trigger("showConsole");
        },

        formatDate: function(date) {
            return Moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
    });

    return AllScoresView;

});
