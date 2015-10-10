// Model for a list of high scores

define([
    'jquery',
    'underscore',
    'backbone',
    'backbonePaginator',
    'moment'
], function($, _, Backbone, BackbonePaginator, Moment) {

    var HighScores = Backbone.PageableCollection.extend({
        url: '/api/games',

        // Initial pagination states
        state: {
            pageSize: 10,
            sortKey: "date",
            order: 1
        },

        // You can remap the query parameters from `state` keys from
        // the default to those your server supports
        queryParams: {
            totalPages: null,
            totalRecords: null,
            sortKey: "sort",
            order: "order",
            pageSize: "limit"
        },

        formatDate: function(date) {
            return Moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },

        // get the state from Github's search API result
        parseState: function (resp, queryParams, state, options) {
            return {totalRecords: resp.itemCount };
        },

        // get the actual records
        parseRecords: function (resp, options) {

            var records = resp.data;

            _.each(records, function(element, index, list) {
                element.prettyDate = this.formatDate(element.date);
            }, this);

            console.log(JSON.stringify(records));

            return resp.data;
        },

        setAllScores: function() {
            this.url = 'api/games';
            this.state.sortKey = "date";
        },
        setUserScores: function() {
            this.url = 'api/games/' + this.username;
            this.state.sortKey = "date";
        },
        setAllTopScores: function() {
            this.url = 'api/games';
            this.state.sortKey = "score";
        },
        setUserTopScores: function() {
            this.url = 'api/games/' + this.username;
            this.state.sortKey = "score";
        },
        setDailyTopScores: function() {
            this.url = 'api/dailygames';
            this.state.sortKey = "score";
        },
        setMonthlyTopScores: function() {
            this.url = 'api/monthlygames';
            this.state.sortKey = "score";
        },
        setUserName: function(username) {
            this.username = username;
        },
        clearUserName: function() {
            delete this.username;
        }
    });

    return HighScores;

});