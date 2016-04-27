define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var SiteNewsModel = Backbone.PageableCollection.extend({
        url: '/api/news?days=60',

        state: {
            pageSize: 10,
            sortKey: "date",
            order: 1
        },

        queryParams: {
            sortKey: "sort",
            order: "order",
            pageSize: "limit"
        },

        parseState: function (resp, queryParams, state, options) {
            return {totalRecords: resp.itemCount };
        },
        
        parseRecords: function (resp, options) {
            return resp.data;
        }
    });

    return SiteNewsModel;

});