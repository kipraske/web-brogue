define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var SiteNewsModel = Backbone.PageableCollection.extend({
        url: '/api/news',

        state: {
            pageSize: 10,
            sortKey: "date",
            order: 1
        },

        queryParams: {
            totalPages: "pageCount",
            totalRecords: "itemCount",
            sortKey: "sort",
            order: "order",
            pageSize: "limit"
        },

        parseState: function (resp, queryParams, state, options) {
            return {totalRecords: resp.itemCount };
        },

        // get the actual records
        parseRecords: function (resp, options) {

            return resp.data;
        }
    });

    return SiteNewsModel;

});