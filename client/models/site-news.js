define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var SiteNewsModel = Backbone.Model.extend({
        defaults: {
            date : "",
            description: ""
        }
    });

    return SiteNewsModel;

});