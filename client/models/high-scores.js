// Model for a list of high scores

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var HighScores = Backbone.PageableCollection.extend({
        url: '/api/games',

        // Initial pagination states
        state: {
            pageSize: 5,
            sortKey: "updated",
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

        // get the state from Github's search API result
        parseState: function (resp, queryParams, state, options) {
            return {totalRecords: resp.itemCount };
        },

        // get the actual records
        parseRecords: function (resp, options) {
            return resp.data;
        },

        setAllScores: function() {
            this.url = 'api/games';
        },
        setUserScores: function() {
            this.url = 'api/games/' + this.username;
        },
        setDailyScores: function() {
            this.url = 'api/dailygames';
        },
        setMonthlyScores: function() {
            this.url = 'api/monthlygames';
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