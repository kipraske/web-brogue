// Embedded high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "dataIO/send-generic",
    "views/view-activation-helpers",
    'moment'
], function ($, _, Backbone, dispatcher, send, activate, Moment) {

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
                    if(formattedValue) {
                        this.$el.append($("<a>", {
                            href: '#brogue',
                            title: this.model.title,
                            id: 'watch-game',
                            "data-gameid": formattedValue,
                            "data-gamedescription": this.model.get("username") + "-" + this.model.get("seed") + "-" + self.formatDate(this.model.get("date"))
                        }).text("Watch game"));
                    }
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
                        sortable: false,
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
                        cell: "integer",
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

            $("#mini-scores-grid").append(this.grid.render().$el);

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

            this.model.setUserScores();
            this.refresh();
        },

        selectAllScores: function(event) {

            event.preventDefault();

            this.model.setAllScores();
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

    return HighScoresView;

});

